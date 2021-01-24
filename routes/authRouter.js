var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');
///change url 
var teacherModel = require('../model/user');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

var router = express.Router();	
router.use(session({
	secret: 'key',
	resave: true,
	saveUninitialized: true
}));
/* GET home page. */
router.get('/login',function(req,res){
    res.render("login.ejs")
  });




module.exports = router;