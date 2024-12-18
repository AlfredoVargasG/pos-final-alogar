const express = require('express');
const { ImagesController } = require('../controllers/images.controller');
const multer = require('multer');
const storage = multer.memoryStorage();
const uploadProducts = multer({ storage: storage });

const router = express.Router();
let LogoCtrl = new ImagesController();

router.get('/:carpeta/:archivo', LogoCtrl.get);
router.post('/upload', uploadProducts.single('image') , LogoCtrl.uploadProductImage);

module.exports = router;