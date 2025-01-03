const express = require('express');
const { ProductsController } = require('../controllers/products.controller');

const router = express.Router();
let ProductsCtrl = new ProductsController();

// Define routes for product operations
router.get('/', ProductsCtrl.getProducts);
router.post('/', ProductsCtrl.addProduct);
/* router.get('/category/:categoryId', ProductsCtrl.getProductsByCategory)
router.get('/search/:product/category/:categoryId', ProductsCtrl.getProductByName)
router.get('/historical', ProductsCtrl.getHistoricalProducts)
 */

module.exports = router;