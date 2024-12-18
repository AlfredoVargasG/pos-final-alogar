const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config(); // Cargar variables de entorno
const { supabase } = require('../supabaseClient');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../firebase/firebase');
const loginUser = require('../firebase/loginFirebase');
const multer = require('multer');

const email = process.env.FIREBASE_EMAIL;
const password = process.env.FIREBASE_PASSWORD;
const url = process.env.URL_SCRAPPING_PRODUCTS; // URL a la que se hará scraping

// Configura multer para manejar la subida de imágenes
const upload = multer({ storage: multer.memoryStorage() });

// Función para obtener las URLs de las categorías
async function getUrlsOfCategories() {
    try {
        const { data: categories, error } = await supabase.from('categories').select('*');
        if (error) {
            console.error('Error al obtener las categorías de la base de datos:', error);
            return [];
        }
        return categories;
    } catch (error) {
        console.error('Error al obtener las categorías de la base de datos:', error);
        return [];
    }
}

// Función para obtener la cantidad de páginas de productos
async function getPagesCount($) {
    const pageText = $('.pagination__text').text().trim();
    const pages = pageText.split(' ')[3];
    return Number(pages) || 1;
}

// Función para obtener los productos de una página
async function getProductsFromPage($, url) {
    const products = [];
    $('.product-card').each((index, element) => {
        const product = $(element).find('.grid-view-item__title').text().trim().replace('/', '-').toLowerCase();
        const price = Number(
            $(element)
                .find('.price')
                .attr('class')
                .includes('price--on-sale')
                ? $(element).find('.price-item--sale').text().trim().replace('$', '').replace('.', '')
                : $(element).find('.price-item--regular').text().trim().replace('$', '').replace('.', '')
        );
        const image = $(element)
            .find('.grid-view-item__image')[0]
            .attribs['data-src']
            .replace('//', 'https://')
            .replace('{width}', '300');
        const productUrl = $(element).find('.grid-view-item__link').attr('href').replace('/', 'https://alogar.cl/');
        products.push({ product, price, image, url: productUrl });
    });
    return products;
}

// Función principal de web scraping
async function scrapeWebsiteProducts() {
    try {
        const { data: productsInDb } = await supabase.from('products').select('*');

        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const totalProducts = Number($('.filters-toolbar__product-count').text().trim().split(' ')[0]);
        if(totalProducts === productsInDb.length) {
            console.log('No hay nuevos productos');
            return;
        }

        const pages = await getPagesCount($);

        const products = [];
        for (let i = 1; i <= pages; i++) {
            const { data } = await axios.get(`${url}?page=${i}`);
            const $ = cheerio.load(data);
            const pageProducts = await getProductsFromPage($, url);
            products.push(...pageProducts);
        }

        // Obtener las URLs de las categorías
        const categories = await getUrlsOfCategories();
        const categorizedProducts = await getCategorizedProducts(categories);

        // Agrupar productos por nombre y categorías
        const finalProducts = groupProductsByCategory(products, categorizedProducts);

        // Iniciar sesión en Firebase
        await loginUser(email, password);

        // Subir imágenes a Firebase Storage
        await uploadProductImages(finalProducts);

        // Insertar productos nuevos en la base de datos
        await insertNewProducts(finalProducts);

    } catch (error) {
        console.error('Error al hacer scraping de los productos:', error);
    }
}

// Función para obtener los productos por categoría
async function getCategorizedProducts(categories) {
    const categorizedProducts = [];
    for (let category of categories) {
        const { data } = await axios.get(category.url_page);
        const $ = cheerio.load(data);
        const pages = await getPagesCount($);

        for (let i = 1; i <= pages; i++) {
            const { data } = await axios.get(`${category.url_page}?page=${i}`);
            const $ = cheerio.load(data);
            const pageProducts = await getProductsFromPage($, category.url_page);
            pageProducts.forEach(product => categorizedProducts.push({ ...product, category: category.category }));
        }
    }
    return categorizedProducts;
}

// Función para agrupar los productos por nombre y categorías
function groupProductsByCategory(products, categorizedProducts) {
    const groupedProducts = {};

    categorizedProducts.forEach(item => {
        if (!groupedProducts[item.product]) {
            groupedProducts[item.product] = {
                product: item.product,
                price: item.price,
                image: item.image,
                url: item.url,
                categories: new Set(),
            };
        }
        groupedProducts[item.product].categories.add(item.category);
    });

    products.forEach(item => {
        if (!groupedProducts[item.product]) {
            groupedProducts[item.product] = {
                product: item.product,
                price: item.price,
                image: item.image,
                url: item.url,
                categories: new Set(['Sin Categoría']),
            };
        }
    });

    return Object.values(groupedProducts).map(product => ({
        ...product,
        categories: Array.from(product.categories),
    }));
}

// Función para subir las imágenes de los productos a Firebase Storage
async function uploadProductImages(products) {
    for (let product of products) {
        const imageFile = await axios.get(product.image, { responseType: 'arraybuffer' });
        const storageRef = ref(storage, `productos/${product.product}.jpg`);
        const snapshot = await uploadBytes(storageRef, imageFile.data, {
            contentType: 'image/jpeg',
        });
        product.image = await getDownloadURL(snapshot.ref);
    }
}

// Función para insertar los productos nuevos en la base de datos
async function insertNewProducts(products) {
    const { data: newProductsInDB, error } = await supabase.from('products').insert(products).select();
    if (error) {
        console.error('Error al insertar los productos en la base de datos:', error);
        return;
    }
    console.log('Productos insertados en la base de datos', newProductsInDB.length);
}

module.exports = { scrapeWebsiteProducts, upload };