var mongoose = require('mongoose');

//var Schema = mongoose.Schema;


const present = new mongoose.Schema({
idcart : String,
prenom : String,
nom : String

});


module.exports = mongoose.model('presentDb', present);