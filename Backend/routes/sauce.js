// Importation d'express
const express = require('express');
// Création du router
const router = express.Router();

// Importation du middleware d'authentification
const auth = require('../middleware/auth');
// Importation du middleware de gestion des fichiers
const multer = require('../middleware/multer-config');

// Importation des contrôleurs de sauce
const sauceCtrl = require('../controllers/sauce');

// Création des routes avec leurs middlewares
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

// Exporte le router
module.exports = router;