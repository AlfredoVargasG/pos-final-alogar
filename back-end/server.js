const express = require('express');
const {scrapeWebsiteCategories} = require('./api/services/web/fetchCategories');
const {scrapeWebsiteProducts} = require('./api/services/web/fetchProducts');
require('dotenv').config(); // Cargar variables de entorno
const routes = require('./api/routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto de la variable de entorno o el 3000 por defecto

app.use(express.json()); // Para parsear solicitudes con cuerpo JSON
app.use(cors()); // Habilitar CORS

// Función asíncrona para ejecutar el scraping en secuencia
const executeScrapingTasks = async () => {
    try {
        await scrapeWebsiteCategories(); // Espera que termine el scraping de categorías

        await scrapeWebsiteProducts(); // Espera que termine el scraping de productos
    } catch (error) {
        console.error('Error al realizar el scraping:', error);
    }
};

// Llamamos a la función de scraping cuando el servidor se inicia
executeScrapingTasks();

// Rutas
app.use('/api', routes);


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
