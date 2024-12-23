const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config(); // Cargar variables de entorno
const { supabase } = require('../supabaseClient');
const { readExcel } = require('../excel/excelCode');
const path = require('path');

// Configuración de rutas y URL
const url = process.env.URL_SCRAPPING_PRODUCTS;
const excelPath = path.join(__dirname, '../excel', 'codigos_productos.xlsx');

// Obtener códigos de productos desde el archivo Excel
async function getCodesOfProducts() {
    try {
        const products = readExcel(excelPath);
        return products.sort((a, b) => a['nombre'].localeCompare(b['nombre']));
    } catch (error) {
        console.error('Error al obtener los códigos de los productos:', error);
        return [];
    }
}

// Obtener las URLs de las categorías desde la base de datos
async function getUrlsOfCategories() {
    try {
        const { data: categories, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return categories;
    } catch (error) {
        console.error('Error al obtener las categorías de la base de datos:', error);
        return [];
    }
}

// Obtener la cantidad de páginas disponibles en la categoría
function getPagesCount($) {
    const pageText = $('.pagination__text').text().trim();
    const pages = parseInt(pageText.split(' ')[3], 10);
    return isNaN(pages) ? 1 : pages;
}

// Extraer productos de una página
function getProductsFromPage($, url) {
    const products = [];
    $('.product-card').each((index, element) => {
        const product = $(element).find('.grid-view-item__title').text().trim().replace('/', '-').toLowerCase();
        const priceClass = $(element).find('.price').attr('class') || '';
        const price = Number(
            priceClass.includes('price--on-sale')
                ? $(element).find('.price-item--sale').text().trim().replace('$', '').replace('.', '')
                : $(element).find('.price-item--regular').text().trim().replace('$', '').replace('.', '')
        );
        const image = $(element)
            .find('.grid-view-item__image')
            .attr('data-src')
            .replace('//', 'https://')
            .replace('{width}', '300');
        const productUrl = $(element).find('.grid-view-item__link').attr('href').replace('/', 'https://alogar.cl/');
        products.push({ product, price, image, url: productUrl });
    });
    return products;
}

// Tokenizar texto para análisis de similitud
function tokenizar(nombre) {
    return nombre.toLowerCase().split(/\s+/);
}

// Calcular similitud entre dos textos
function calcularSimilitud(nombre1, nombre2) {
    const palabras1 = new Set(tokenizar(nombre1));
    const palabras2 = new Set(tokenizar(nombre2));
    const interseccion = [...palabras1].filter(palabra => palabras2.has(palabra)).length;
    const union = new Set([...palabras1, ...palabras2]).size;
    return interseccion / union;
}

// Relacionar listas de productos
function relacionarListas(lista1, lista2, umbral = 0.5) {
    return lista1.map(producto1 => {
        let mejorCoincidencia = null;
        let mejorSimilitud = 0;

        lista2.forEach(producto2 => {
            const similitud = calcularSimilitud(producto1.product, producto2.nombre);
            if (similitud > mejorSimilitud && similitud >= umbral) {
                mejorSimilitud = similitud;
                mejorCoincidencia = producto2;
            }
        });

        return {
            producto1,
            coincidencia: mejorCoincidencia,
            similitud: mejorSimilitud,
        };
    });
}

// Obtener productos organizados por categorías
async function getCategorizedProducts(categories) {
    const categorizedProducts = [];
    for (const category of categories) {
        if (!category.url) continue;
        const { data } = await axios.get(category.url);
        const $ = cheerio.load(data);
        const pages = getPagesCount($);

        for (let i = 1; i <= pages; i++) {
            const { data } = await axios.get(`${category.url}?page=${i}`);
            const $ = cheerio.load(data);
            const pageProducts = getProductsFromPage($, category.url);
            categorizedProducts.push(...pageProducts.map(product => ({ ...product, principal_category_id: category.id })));
        }
    }
    return categorizedProducts;
}

// Agrupar productos por categoría
function groupProductsByCategory(products, categorizedProducts) {
    const groupedProducts = {};

    categorizedProducts.forEach(product => {
        if (!groupedProducts[product.product]) {
            groupedProducts[product.product] = {
                ...product,
                categories_id: new Set(),
            };
        }
        groupedProducts[product.product].categories_id.add(product.categoryId);
    });

    products.forEach(product => {
        if (!groupedProducts[product.product]) {
            groupedProducts[product.product] = {
                ...product,
                categories_id: new Set([13]), // Categoría por defecto
            };
        }
    });

    return Object.values(groupedProducts).map(product => ({
        ...product,
        categories_id: Array.from(product.categories_id),
        principal_category_id: Array.from(product.categories_id)[0],
    }));
}

// Insertar nuevos productos en la base de datos
async function insertNewProducts(products) {
    try {
        const { error } = await supabase.from('products').insert(products);
        if (error) throw error;
        console.log(`Se insertaron ${products.length} productos nuevos.`);
    } catch (error) {
        console.error('Error al insertar productos:', error);
    }
}

// Función principal para hacer scraping
async function scrapeWebsiteProducts() {
    try {
        const { data: productsInDb } = await supabase.from('products').select('*');
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const pages = getPagesCount($);

        const products = [];
        for (let i = 1; i <= pages; i++) {
            const { data } = await axios.get(`${url}?page=${i}`);
            const $ = cheerio.load(data);
            products.push(...getProductsFromPage($, url));
        }

        const categories = await getUrlsOfCategories();
        const categorizedProducts = await getCategorizedProducts(categories);
        let groupedProducts = groupProductsByCategory(products, categorizedProducts);

        const productCodes = await getCodesOfProducts();
        let relaciones = relacionarListas(groupedProducts, productCodes, 0.3);

        groupedProducts = groupedProducts.map(product => {
            return {
                ...product,
                code_product: relaciones.find(relacion => relacion.producto1.product === product.product)?.coincidencia?.codigobarra || '',
            }
        })

        const newProducts = groupedProducts.filter(product => !productsInDb.some(productInDb => productInDb.product === product.product));
        if(newProducts.length > 0) await insertNewProducts(newProducts);
    } catch (error) {
        console.error('Error durante el scraping:', error);
    }
}

module.exports = { scrapeWebsiteProducts };