const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config(); // Cargar variables de entorno
const { supabase } = require('../supabaseClient');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../firebase/firebase');
const loginUser = require('../firebase/loginFirebase');

const email = process.env.FIREBASE_EMAIL;
const password = process.env.FIREBASE_PASSWORD;
const url = process.env.URL_SCRAPPING_CATEGORIES; // URL a la que se hará scraping

// Función para subir las imágenes de las categorias a Firebase Storage
async function uploadProductImages(categories) {
    for (let category of categories) {
        const imageFile = await axios.get(category.image, { responseType: 'arraybuffer' });
        const storageRef = ref(storage, `categories/${category.category}.jpg`);
        const snapshot = await uploadBytes(storageRef, imageFile.data, {
            contentType: 'image/jpeg',
        });
        category.image = await getDownloadURL(snapshot.ref);
    }
}

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

        // Iniciar sesión en Firebase
        await loginUser(email, password);

        // Subir imágenes a Firebase Storage
        await uploadProductImages(categories);

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