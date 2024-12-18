const express = require('express');

const router = express.Router();

// Importar rutas
const productRoutes = require('./products.routes');
const categoryRoutes = require('./category.routes');
const imagesRoutes = require('./images.routes');

// Usar rutas
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/images', imagesRoutes);

module.exports = router;