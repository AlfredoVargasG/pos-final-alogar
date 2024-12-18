const { ref, getDownloadURL, uploadBytes } = require('firebase/storage');
const { storage } = require('../services/firebase/firebase');
const loginUser = require('../services/firebase/loginFirebase');
require('dotenv').config();

const email = process.env.FIREBASE_EMAIL;
const password = process.env.FIREBASE_PASSWORD;

class ImagesController {
    async get(req, res) {
        try {
            await loginUser(email, password);

            const { carpeta, archivo} = req.params;

            const storageRef = ref(storage, `${carpeta}/${archivo}.png`);

            const url = await getDownloadURL(storageRef);

            return res.json({ url });
        } catch (error) {
            console.error('Error al obtener el logo:', error);
            return res.status(500).send({ message: 'Error al obtener el logo' });
        }
    }

    async uploadProductImage(req, res) {
        try {
            await loginUser(email, password);
    
            const file = req.file;
    
            if (!file) {
                return res.status(400).send({ message: 'No se ha subido ninguna imagen' });
            }
    
            const storageRef = ref(storage, `productos/${file.originalname}`);
    
            // Subir la imagen
            await uploadBytes(storageRef, file.buffer);  // Usar el buffer para subir el archivo

            let url = await getDownloadURL(storageRef);

            return res.status(201).json({ url });
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            return res.status(500).send({ message: 'Error al subir la imagen' });
        }
    }
}

module.exports = {ImagesController};