var mongoose = require('mongoose');

//var Schema = mongoose.Schema;


const myhistory = new mongoose.Schema({
idcart : String,
prenom : String,
nom : String,
dateEntre: Date


});


module.exports = mongoose.model('historique', myhistory);