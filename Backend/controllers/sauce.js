// Importation du modèle de sauce
const Sauce = require('../models/sauce');
// Importation de file system
const fs = require('fs');

// Contrôleur de la route POST
exports.createSauce = (req, res, next) => {
    // Extrait les données JSON de l'objet crée
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        // Génère l'URL de l'image de la sauce crée
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []    
    });
    // Enregistre la sauce dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch((error) => res.status(400).json({ error: error }));
};
  
// Contrôleur de la route GET pour une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error: error }));
};

// Contrôleur de la route GET pour toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(404).json({ error: error }));
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
        .then(() => res.status(200).json({ message : 'Sauce modifiée !'}))
        .catch(error => res.status(401).json({ error }));   
};

// Contrôleur de la route DELETE
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            // Nom du fichier image à supprimer
            const filename = sauce.imageUrl.split('/images/')[1];
            // Suppression du fichier image
            fs.unlink(`images/${filename}`, () => {
                // Suppression de la sauce de la base de données
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(401).json({ error }));
            });            
        })
        .catch( error => res.status(500).json({ error }))
 };

 // Contrôleur des likes / dislikes
exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const sauceId = req.params.id;
    const like = req.body.like;

    switch (like) {        
        // Si l'utilisateur dislike la sauce
        case -1: 
            // Mettre à jour le nombre de dislikes +1
            Sauce.updateOne({ _id: sauceId }, { $inc: {dislikes: 1}, $push: {usersDisliked: userId} })
                .then(() => res.status(200).json({ message : 'Vous avez disliké la sauce'}))
                .catch(error => res.status(401).json({ error }));
            break;

        // Si l'utilisateur dislike ou like à nouveau la sauce
        case 0:
            Sauce.findOne({ _id: sauceId })
                .then(sauce => {
                    // Si l'utilisateur dislike à nouveau la sauce
                    if (sauce.usersDisliked.includes(userId)) {
                        // Mettre à jour le nombre de dislikes -1 
                        Sauce.updateOne({ _id: sauceId }, { $inc: {dislikes: -1}, $pull: {usersDisliked: userId} })
                            .then(() => res.status(200).json({ message : 'Vous avez retiré votre dislike'}))
                            .catch(error => res.status(401).json({ error }));
                    }
                    // Si l'utilisateur like à nouveau la sauce
                    else if (sauce.usersLiked.includes(userId)) {
                        // Mettre à jour le nombre de likes -1 
                        Sauce.updateOne({ _id: sauceId }, { $inc: {likes: -1}, $pull: {usersLiked: userId} })
                            .then(() => res.status(200).json({ message : 'Vous avez retiré votre like'}))
                            .catch(error => res.status(401).json({ error }));
                    }
                })
                .catch(error => res.status(400).json({ error }));
            break;

        // Si l'utilisateur like la sauce  
        case 1:         
            // Mettre à jour le nombre de likes +1
            Sauce.updateOne({ _id: sauceId }, { $inc: {likes: 1}, $push: {usersLiked: userId} })
                .then(() => res.status(200).json({ message : 'Vous avez liké la sauce'}))
                .catch(error => res.status(401).json({ error }));
            break;
    }
}