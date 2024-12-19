const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config(); // Cargar variables de entorno
const { supabase } = require('../supabaseClient');

const email = process.env.FIREBASE_EMAIL;
const password = process.env.FIREBASE_PASSWORD;
const url = process.env.URL_SCRAPPING_CATEGORIES; // URL a la que se hará scraping

// Función de web scraping para obtener las categorías
async function scrapeWebsiteCategories() {
    try {
        const { data: categoriesInDB } = await supabase.from('categories').select('*');
        let cantCategories = 0; // Inicializar la variable para contar

        // Hacer la petición HTTP
        const { data } = await axios.get(url);
        
        // Cargar el HTML en cheerio
        const $ = cheerio.load(data);
        
        // Buscar todos los elementos con la clase .collection-grid-item
        const categories = [];
        
        $('.collection-grid-item').each((index, element) => {
            // Incrementar el contador por cada elemento encontrado
            cantCategories++;
        
            const category = $(element).find('.collection-grid-item__title.h3').text().trim().toLowerCase();
            const url = $(element).find('.collection-grid-item__link').attr('href').replace('/', 'https://alogar.cl/');
            const image = $(element).find('.collection-grid-item__overlay').attr('data-bgset').split(' ')[0].replace('//', 'https://');
            
            categories.push({ category, url, image });
        });
        
        if(cantCategories + 1 === categoriesInDB.length){
            console.log('No hay nuevas categorías');
            return;
        }

        categories.push({ category: 'Otros', url: '', image: '' });

        const { data: newCategoriesDB, error } = await supabase.from('categories').insert(categories);

        if (error) {
            console.error('Error al insertar las categorías en la base de datos:', error);
            return [newCategoriesDB];
        }else {
            console.log('Categorías insertadas en la base de datos', categories.length);
        }

    } catch (error) {
        console.error('Error al hacer scraping:', error);
        return [];
    }
}

module.exports = scrapeWebsiteCategories;