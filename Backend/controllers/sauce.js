// Importation du modèle de sauce
const Sauce = require('../models/Sauce');
// Importation de file system
const fileSystem = require('fs');

// Contrôleur de la route POST
exports.createSauce = (req, res, next) => {
    // Extrait les données JSON de l'objet crée
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        // Génère l'URL de l'image de la sauce crée
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []    
    });
    // Enregistre la sauce dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch((error) => res.status(400).json({ error: error }))
};
  
// Contrôleur de la route GET pour une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error: error }))
};

// Contrôleur de la route GET pour toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error: error }))
};

// Contrôleur de la route PUT
exports.modifySauce = (req, res, next) => {
    // Contrôle si une image est téléchargée avec la sauce
    const sauceObject = req.file ? {
        // Récupère les informations en format JSON
        ...JSON.parse(req.body.sauce),
        // Génère une nouvelle URL pour l'image de la sauce
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`    
    } : { ...req.body };
    // Mise à jour de la sauce dans la base de données
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({ message : 'Sauce modifié!'}))
        .catch(error => res.status(401).json({ error }))         
};

// Contrôleur de la route DELETE
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            // Nom du fichier image à supprimer
            const filename = sauce.imageUrl.split('/images/')[1];
            // Suppression du fichier image
            fileSystem.unlink(`images/${filename}`, () => {
                // Suppression de la sauce de la base de données
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                    .catch(error => res.status(401).json({ error }))
            });            
        })
        .catch( error => res.status(500).json({ error }))
 };