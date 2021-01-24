const mongoose = require('mongoose')

const userSchema = mongoose.Schema({


    unique_id: Number,
	email: String,
	username: String,
    password: String,
    passwordConf: String

})



module.exports = mongoose.model('admins', userSchema);