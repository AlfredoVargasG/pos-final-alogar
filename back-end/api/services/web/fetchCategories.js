const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config(); // Cargar variables de entorno
const { supabase } = require('../supabaseClient');
const url = process.env.URL_SCRAPPING_CATEGORIES; // URL a la que se hará scraping

// Función para obtener las categorías existentes en la base de datos
async function getCategoriesFromDB() {
    try {
        const { data: categoriesInDB, error } = await supabase.from('categories').select('*');
        if (error) {
            console.error('Error al obtener las categorías de la base de datos:', error);
            return [];
        }
        return categoriesInDB || [];
    } catch (error) {
        console.error('Error al obtener las categorías de la base de datos:', error);
        return [];
    }
}

// Función para realizar scraping de las categorías desde el sitio web
async function scrapeCategoriesFromWebsite() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const categories = [];
        $('.collection-grid-item').each((index, element) => {
            const category = $(element).find('.collection-grid-item__title.h3').text().trim().toLowerCase();
            const categoryUrl = $(element).find('.collection-grid-item__link').attr('href').replace('/', 'https://alogar.cl/');
            const image = $(element).find('.collection-grid-item__overlay').attr('data-bgset').split(' ')[0].replace('//', 'https://');

            categories.push({ category, url: categoryUrl, image });
        });

        // Agregar una categoría adicional
        categories.push({ category: 'Otros', url: '', image: '' });
        return categories;
    } catch (error) {
        console.error('Error al hacer scraping de las categorías:', error);
        return [];
    }
}

// Función para insertar categorías nuevas en la base de datos
async function insertNewCategories(categories) {
    try {
        const { data: newCategoriesInDB, error } = await supabase.from('categories').insert(categories).select();
        if (error) {
            console.error('Error al insertar las categorías en la base de datos:', error);
            return;
        }
        console.log('Categorías insertadas en la base de datos:', newCategoriesInDB.length);
    } catch (error) {
        console.error('Error al insertar las categorías en la base de datos:', error);
    }
}

// Función principal de scraping de categorías
async function scrapeWebsiteCategories() {
    try {
        const categoriesInDB = await getCategoriesFromDB();
        const scrapedCategories = await scrapeCategoriesFromWebsite();

        // Verificar si hay categorías nuevas comparando con la base de datos
        const newCategories = scrapedCategories.filter(
            category => !categoriesInDB.some(dbCategory => dbCategory.category === category.category)
        );

        if (newCategories.length === 0) {
            console.log('No hay nuevas categorías');
            return;
        }

        await insertNewCategories(newCategories);
    } catch (error) {
        console.error('Error en el proceso de scraping de categorías:', error);
    }
}

module.exports = { scrapeWebsiteCategories };
