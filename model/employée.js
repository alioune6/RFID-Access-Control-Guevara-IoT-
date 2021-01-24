
var mongoose = require('mongoose');

//var Schema = mongoose.Schema;


const myuser = new mongoose.Schema({
idcart : { type:String , required:true ,trim:true ,min: [2, 'too small age']}, 
nom :{ type:String , required:true ,trim:true ,min: [1, 'too small age'], max: 10},
prenom :{ type:String , required:true ,trim:true ,min: [1, 'too small age'], max: 10},
email :{ type:String , required:true ,trim:true ,min: [1, 'too small age'], max: 10},
adresse :{ type:String , required:true ,trim:true ,min: [1, 'too small age'], max: 10},
telephone :{ type:String , required:true ,trim:true ,min: [1, 'too small age'], max: 10},
email: String,
	username: String,
	password: String

});


module.exports = mongoose.model('users', myuser);