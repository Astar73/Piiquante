// Improtation de JsonWebToken
const jwt = require('jsonwebtoken');

// Middleware d'authentification de l'utilisateur
module.exports = (req, res ,next) => {
    try {
        // Récupère le token de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Vérifie si la clé d'auuthentification est la bonne
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Récupère l'userID du token
        const userId = decodedToken.userId;
        // Vérifie si l'userId est le même que dans la requête
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Identifiant utilisateur invalide';
        }
        // Autorise la requête
        else {
            next();
        }
    }
    catch(error) {
        res.status(401).json({ error: new Error('Requête invalide') })
    }
};