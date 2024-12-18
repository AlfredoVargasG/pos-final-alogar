const express = require('express');
const { CategoriesController } = require('../controllers/category.controller');

const router = express.Router();
let CategoriesCtrl = new CategoriesController();

router.get('/', CategoriesCtrl.getCategories);

module.exports = router;