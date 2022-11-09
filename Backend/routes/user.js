// Importation d'express 
const express = require('express');
// Création du router
const router = express.Router();
// Importation des contrôleurs d'utilsiateur
const userCtrl = require('../controllers/user');

// Création des routes d'inscription et de connexion de l'utilisateur
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exporte le router
module.exports = router;