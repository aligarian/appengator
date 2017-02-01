var express = require('express');
var md5 = require('md5');
var router = express.Router();
var Usercollection = require('./../model/usersSchema.js');
var mongoose = require('mongoose');
var mongoURI = "mongodb://localhost:27017/appengator";
var db = mongoose.createConnection(mongoURI);
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	passport.use(new LocalStrategy(
	  function(username, password, done) {
	  	//console.log(username);
	    Usercollection.findOne({ username: username }, function (err, user) {
	      if (err) { return done(err); }
	      if (!user) {
	      	return done(null, false, { message: 'Incorrect username.' });
	      }
	      else{
	      	return done(null, user);
	      }
	      // if (!user.validPassword(password)) {
	      //   return done(null, false, { message: 'Incorrect password.' });
	      // }
	      
	    });
	  }
	));
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(user, done) {
	  done(null, user);
	});
	router.post('/', passport.authenticate('local', {
	  successRedirect: '/automation-panel',
	  failureRedirect: '/'
	  })
	);
 	// router.post('/', function(req, res, next) {
	//  	// console.log(Users);
	//  	// Usercollection({username: 'admin3', email: 'admin3@gmail.com',password:'password'}).save();
	//  	console.log(req.body.Password +'==='+req.body.User);
	//  	Usercollection.find({ username: req.body.User, password:req.body.Password }, function(error, username) {
	//        	if (error) return handleError(error);
 //  			// console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation)
	//        	console.log(username);
	//        	if(username.length > 0){
	//        		var sess = req.session;
	//        		sess.loginError = 0;
	//        		sess.user_id= username._id;
	// 	       	sess.username = username.username;
	// 			sess.password = username.password;
	// 			res.redirect("/users");
	//        	}
	//        	else{
	//        		var sess = req.session;
	// 	       	sess.loginError = 1;
	//        		res.redirect("/");
	//        	}
	       	
	// 		//console.log("hello "+req.body.User+' your password is :'+req.body.Password);
	// 		//res.send("hello "+req.body.User+' your password is :'+req.body.Password);
	// 	});
	// });
	
});

/* GET users listing. */


module.exports = router;