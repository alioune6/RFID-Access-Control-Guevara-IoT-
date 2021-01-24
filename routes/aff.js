
const router = require("express").Router();

var morgan = require("morgan");

var UsersModel = require('../model/employée');
var HistoryModel = require('../model/historique');
var HistorySortieModel = require('../model/historiqueSortie');
var PresentModel = require('../model/present');
const bodyParser = require("body-parser");

const session = require('express-session');
var teacherModel = require('../model/user');
const bcryptjs = require('bcryptjs');
const { countDocuments } = require("../model/employée");
const saltRounds = 10;
let id = '';
let test = 0;



const urlencodeParser = bodyParser.urlencoded({ extended :false})
router.get('/',function(req,res){
  res.render("index.ejs")
});

router.get('/readcard',function(req,res){
  var user = {
    identif: id
  }
  res.render("readcard.ejs", {
    user: user
  })

});

router.post('/readcards',async (req, res, next) =>{

   var identif = req.body.idcart;
   var user = await UsersModel.findOne({idcart: identif}).exec();
   if(!user){
    
     res.send("Non autorisé");
   id = '';
   test = 1;

    }
    else{
    
   var aby = await PresentModel.findOne({'idcart': identif}).exec();
   id = '';
   if(!aby){
   var user = UsersModel.find({'idcart': identif}, (err, docs) => {
    
        
        var hist = {
           idcart: docs[0].idcart,
          prenom: docs[0].prenom,
          nom: docs[0].nom,
          dateEntre: new Date()
        }
        
        var pres = {
          idcart: docs[0].idcart,
          prenom: docs[0].prenom,
          nom: docs[0].nom,
        }

        var data = HistoryModel(hist); 
        var data1 = PresentModel(pres);
        data1.save(function (err, docs) {
          if(err){
            console.log('Erreur  denregistre sur la liste des presents');
          }
          else{
            console.log('Enregistre sur la liste des presents ');
          }
        })
  
     data.save(function (err,red) {
    if(err){
      //res.render('ajouter', { errorMsg : 'problem essaie une autre fois' });
      console.log('Not Save');
     }else{
      //res.render('ajouter', { message: 'ADD successfully!'});
      console.log(' save');
      console.log('data '+ data);
     }

   })
  });
}
else{
  UsersModel.find({'idcart': identif}, (err, docs) =>{

    var histSortie = {
      idcart: docs[0].idcart,
      prenom: docs[0].prenom,
      nom: docs[0].nom,
      dateEntre: new Date()
    }

    var data = HistorySortieModel(histSortie); 
  
     data.save(function (err,red) {
    if(err){
      //res.render('ajouter', { errorMsg : 'problem essaie une autre fois' });
      console.log('Not Save');
     }
     else{
      //res.render('ajouter', { message: 'ADD successfully!'});
      console.log(' save');
      console.log('data '+ data);

      PresentModel.findOneAndDelete({'idcart': identif}, (err, docs) =>{
        if(err){
          console.log('Non supprimer dans la liste des present ');
        }
        else
        {
          console.log('Supprimer dans la liste des presents ');
        }
      })

     }

  })
})
}
  
}
})

 
router.get('/aj',function(req,res){
  
  var user = {
    identif: id
  }
  
  res.render("ajout.ejs", {
    user: user
  })
});

router.post('/api', (req, res, next) =>{
  var data ='';
  req.on('data', chunk =>{
    data += chunk;
    
  })
  req.on('end', () =>{
   
    data = data.toString();
    console.log('Identifiant ' +data);

    id = data;
  
  })
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  if (test == 1 ){
  res.end(test);
  test = 0;
  }
  else
  res.end('receive');

 
});
  

router.post('/add',urlencodeParser, 
 function (req, res, next) {
   
    console.log(req.body);
  
    const mybodydata = {
      idcart: req.body.idcart,
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      adresse: req.body.adresse,
      telephone: req.body.telephone
    }
    var data = UsersModel(mybodydata); 
    //var data = UsersModel(req.body);
    data.save(function (err,red) {
      if(err){
        res.render('ajouter', { errorMsg : 'problem essaie une autre fois' });
        id = '';
       }else{
        res.render('ajouter', { message: 'ADD successfully!'});
        id = '';
       }
    })
  });
 
  router.get('/delete/:id', function(req, res) {
    UsersModel.findByIdAndRemove(req.params.id, function(err, project) {
        if (err) {
          console.log('problem')

            res.redirect('/gestionUtilisateur');
        } else {

           console.log('delete')
            res.redirect('/gestionUtilisateur');
        }
    });
});
router.get('/gestionUtilisateur', function(req, res) {
  UsersModel.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('gestionUtilisateur', { users: users });
      console.log(users);
    }
}); 


});

 /* GET SINGLE User BY ID */

 router.get('/edit/:id', function(req, res) {
  UsersModel.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.render('UpdateForm', { user });
    }
  });
});




router.post('/edit/:id', function(req, res) {
  UsersModel.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if(err){
      //req.flash('error_msg', 'Something went wrong! User could not updated.');
      res.redirect('/');
  } else {
   // req.flash('success_msg', 'Record Updated');
    res.redirect('/gestionUtilisateur');
  }
  });
});
  


router.get('/affichaHistorique', function(req, res) {
  HistoryModel.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('showHistory.ejs', { users: users });
      console.log(users);
    }
}); 

});

router.get('/affichaHistorique',function(req,res){
  res.render('showHistorysortie.ejs')
  })


  router.get('/showHistorysortie', function(req, res) {
    HistorySortieModel.find(function(err, users) {
      if (err) {
        console.log(err);
      } else {
        res.render('showHistorysortie.ejs', { users: users });
        console.log(users);
      }
  }); 
  
  });
  
  router.get('/showHistorysortie',function(req,res){
    res.render('showHistorysortie.ejs')
    })

    router.get('/showpresent', function(req, res) {
      PresentModel.find(function(err, users) {
        if (err) {
          console.log(err);
        } else {
          res.render('showpresent.ejs', { users: users });
          console.log(users);
        }
    }); 
    
    });
    
    router.get('/showpresent',function(req,res){
      res.render('showpresent.ejs')
      });

      router.get('/', (req, res, next) =>{
        res.redirect('/index.ejs');
      })
  
  
  router.get('/delete_history/:id', function(req, res) {
    //var supp = req.body.idcart;
    HistoryModel.findByIdAndRemove(req.params.id, function(err, docs) {
        if (err) {
          console.log('problem')

            res.redirect('/affichaHistorique');
        } else {

           console.log('delete')
            res.redirect('/affichaHistorique');
        }
    });
});

     


 

  router.get('/login', function(req, res, next) {
    
     res.render('login');
    //res.redirect('/');
    
  });

 
  




 router.post('/login', (req, res, next) => {
	//console.log(req.body);
	teacherModel.findOne({ email: req.body.email }, (err, data) => {
		if (data) {

			if (data.password == req.body.password) {
				//console.log("Done Login");
				req.session.user_sid = data.unique_id;
				//console.log(req.session.userId);
        //res.send({ "Success": "Success!" });
        res.redirect('/');


			} else {
        //res.send({ "Success": "Wrong password!" });
        res.render('login', { errorMsg: 'Wrong password!'});

        
			}
		} else {
      res.render('login', { errorMsg: 'This Email Is not regestered!'});

		//	res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

 

  router.get('/forgetpass', (req, res, next) => {
    res.render("forget.ejs");
  });
  router.post('/forgetpass', (req, res, next) => {
    //console.log('req.body');
    //console.log(req.body);
    teacherModel.findOne({ email: req.body.email }, (err, data) => {
      console.log(data);
      if (!data) {
        res.render('forget', { message: 'This Email Is not regestered'});

        //res.send({ "Success": "This Email Is not regestered!" });
      } else {
        // res.send({"Success":"Success!"});
        if (req.body.password == req.body.passwordConf) {
          data.password = req.body.password;
          data.passwordConf = req.body.passwordConf;
  
          data.save((err, Person) => {
            if (err)
              console.log(err);
            else
              console.log('Success');
            res.render('forget', { message: 'Password changed!'});
            //res.render('login', { message: 'Password changed!'});

          });
        } else {
          res.render('forget', { errorMsg : 'Password does not matched! Both Password should be same.' });
        }
      }
    });
  
  });
  
  router.get('/registre',function(req,res){
    res.render("registerr.ejs")
  });

  router.post('/regis', (req, res, next) => {
    console.log(req.body);
    var personInfo = req.body;
  
  
    if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
      res.send();
    } else {
      if (personInfo.password == personInfo.passwordConf) {
  
        teacherModel.findOne({ email: personInfo.email }, (err, data) => {
          if (!data) {
            var c;
            teacherModel.findOne({}, (err, data) => {
  
              if (data) {
                console.log("if");
                c = data.unique_id + 1;
              } else {
                c = 1;
              }
  
              var newPerson = new teacherModel({
                unique_id: c,
                email: personInfo.email,
                username: personInfo.username,
                password: personInfo.password,
                passwordConf: personInfo.passwordConf
              });
  
              newPerson.save((err, Person) => {
                if (err)
                  console.log(err);
                else
                  console.log('Success');
              });
  
            }).sort({ _id: -1 }).limit(1);
            //res.send({ "Success": "You are regestered,You can login now." });
            res.render('registerr', { message: 'You are regestered,You can login now.'});

          } else {
           // res.send({ "Success": "Email is already used." });
            res.render('registerr', { errorMsg: 'Email is already used'});

          }
  
        });
      } else {
        res.render('registerr', { errorMsg: 'password is not matched'});

        //res.send({ "Success": "password is not matched" });
      }
    }
  });
  
  
  

module.exports = router;