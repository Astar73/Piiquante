// Importation d'express
const express = require('express');
// Importation de body-parser ( parse les requêtes au format JSON) 
const bodyParser = require('body-parser');
// Importation de mongoDB
const mongoose = require('mongoose');
// Chemin d'accès à un fichier téléchargé par un utilisateur
const path = require('path');
// Importation des routes CRUD
const sauceRoutes = require('./routes/sauce');
// Importation des routes d'utilisateur
const userRoutes = require('./routes/user');

// Connexion à la base de données mongoDB
mongoose.connect('mongodb+srv://openclassroom:openclassroom123@piiquante.16s0t42.mongodb.net/DataBase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Utilisation d'express
const app = express();

// Headers pour les requêtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Intégration de body-parser
app.use(bodyParser.json());

// Middleware de téléchargement de fichiers
app.use('/images', express.static(path.join(__dirname, 'images')));
// Middleware des routes sauces
app.use('/api/sauces', sauceRoutes);
// Middleware des routes utilisateurs
app.use('/api/auth', userRoutes);

module.exports = app;