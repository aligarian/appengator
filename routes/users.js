var express = require('express');
var router = express.Router();
var Newapp = require('./../model/usersApp.js');
var mongoose = require('mongoose');
var mongoURI = "mongodb://localhost:27017/appengator";
var db = mongoose.createConnection(mongoURI);
/* GET users listing. */
router.get('/', function(req, res, next) {
	//if (req.isAuthenticated()){  
		Newapp.find(function (err, userapps) {
		  if (err) return console.error(err);
		  //console.log(userapps);
		  var message = req.query.notice;
		  res.render('users/app-index', { title: 'Express', userapps:userapps, notice:message});
		});
		
	// }
	// else{
	// 	res.redirect('/');
	// }
	
	
	
	// var sess = req.session;
	// if(sess.username != null){
	// 	// res.send("hello "+ sess.username);
	//	console.log(req.user.username);
	// }
	// else{
	// 	req.redirect('/');
	// }
	// res.sendFile("fileUpload.html");
  	// res.send("hello success");
  	// res.render('users/index', { title: 'Express'});
});

module.exports = router;
