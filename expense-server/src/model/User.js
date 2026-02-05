const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({             // creates schema from .Schema
    name: { type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: false},
    googleId: {type: String, required: false},
    role: {type: String, required: true},
    adminId: {type: mongoose.Schema.Types.ObjectId, ref: "User" , index: true},
});

module.exports = mongoose.model('User', userSchema);   // creates model from schema and exports it so that other files can use it

// privacy policy defines how website handles data and if voilated user may file a case on the website for revealing sensitive data
// / for now store in plin text and apply encryption

