const express = require('express');
const { ProductsController } = require('../controllers/products.controller');

const router = express.Router();
let ProductsCtrl = new ProductsController();

// Define routes for product operations
router.get('/', ProductsCtrl.getProducts);
/* router.get('/category/:categoryId', ProductsCtrl.getProductsByCategory)
router.get('/search/:product/category/:categoryId', ProductsCtrl.getProductByName)
router.get('/historical', ProductsCtrl.getHistoricalProducts)
router.post('/', ProductsCtrl.addProduct); */

module.exports = router;