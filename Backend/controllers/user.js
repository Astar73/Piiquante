// Importation de bcrypt
const bcrypt = require('bcrypt');
// Importation de JsonWebToken
const jwt = require('jsonwebtoken');

// Importation du modèle utilisateur
const User = require('../models/User');

// Contrôleur de création d'un utilisateur
exports.signup = (req, res, next) => {
    // Cryptage du mot de passe avec bcrypt
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Enregistre l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
                .catch(error => res.status(400).json({ error })) ;      
        })
        .catch(error => res.status(500).json({ error }));
};

// Contrôleur de connexion d'un utilisateur
exports.login = (req, res, next) => {
    // Vérifie si l'utilisateur existe déjà
    User.findOne({ email: req.body.email })
    .then(user => {
        // Si l'utilisateur n'éxiste pas
        if (!user) {            
            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' }); /* On n'indique pas si l'utilisateur existe déjà où non dans la base de données par soucis de confidentialité */
        }
        else {
            // Vérifie que le mot de passe est identique à celui de la base de données
            bcrypt.compare(req.body.password, user.password)           
            .then(valid => {
                // Si le mot de passe n'est pas valide
                if (!valid) {
                    res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' })
                }
                else {
                    res.status(200).json({
                        userId: user._id,
                        // Création d'un token d'authentification aléatoire
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            // Définit l'expiration du token dans 24h
                            { expiresIn: '24h' }
                        )
                    });
                }
            })
            .catch(error => res.status(500).json({ error }))
        }
    })
    .catch(error => res.status(500).json({ error }))
};