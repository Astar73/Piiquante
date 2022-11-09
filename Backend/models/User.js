// Importation de Mongoose
const mongoose = require('mongoose');
// Importation de Mongoose Unique Validator
const uniqueValidator = require('mongoose-unique-validator');

// Schéma de donnée pour un utilisateur sur mongoDB
const userSchema = mongoose.Schema({
    email: { type : String, required: true, unique: true },
    password: { type: String, required: true }
});

// Validation mongoose pour avoir un email unique
userSchema.plugin(uniqueValidator);

// Exporte le schéma de donnée
module.exports = mongoose.model('User', userSchema);