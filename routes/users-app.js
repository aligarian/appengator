var express = require('express');
var router = express.Router();
var md5 = require('md5');
var Newapp = require('./../model/usersApp.js');
var mongoose = require('mongoose');
var mongoURI = "mongodb://localhost:27017/appengator";
var db = mongoose.createConnection(mongoURI);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {	
	/* GET app listing. */
	router.get('/app-create', function(req, res, next) {
		// if (req.isAuthenticated()){  
			// Newapp.find(function (err, userapps) {
			//   if (err) return console.error(err);
			//   res.render('users/app-create', { title: 'Express', userapps:userapps});
			// });
			res.render('users/app-create', { title: 'Express'});
		// }
		// else{
		// 	res.redirect('/');
		//  }
	});
	/* app delete */
	router.get('/app-delete/:id', function(req, res, next) {
		if (req.isAuthenticated()){  
			Newapp.remove({ '_id' : req.params.id }, function(err) {
		        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
		    });	
		}
		else{
			res.redirect('/');
		 }
		
	});
	/* Get Edit app data */
	router.get('/app-edit/:id', function(req, res, next) {
		// if (req.isAuthenticated()){  
			Newapp.find({'_id':req.params.id},function (err, app) {
				console.log(app);
				if (err) return console.error(err);
				res.render('users/app-edit', { title: 'Express', app:app[0]});
			});
		// }
		// else{
		// 	res.redirect('/');
	 //	}
	});
	/* POST Edit app data */
	router.post('/app-edit/:id', function(req, res, next) {
		if (req.isAuthenticated()){  
			//var newapp = new Newapp();
			Newapp.findById(req.params.id, function (err, newapps) {
				console.log(newapps);
			  if (err) return console.log(err);
			  newapps.app_name = req.body.app_name;
			  newapps.app_type = req.body.app_type;
			  newapps.app_url = req.body.app_url;
			  newapps.updated_at= Date.now();
			  console.log(req.body.app_name);
			  	console.log(newapps);
			  newapps.save(function (err) {
			    if (err) return console.log(err);
			    // console.log(req.body.app_name);
			   	var string = encodeURIComponent('edit-success');
  					res.redirect('/automation-panel?notice=' + string);
			  	});
			});
			
		}
		else{
			res.redirect('/');
		 }
		
	});
	/* POST create app data */
	router.post('/app-create', function(req,res,next){
	 	var newapp = new Newapp({
	 		user_id:req.user._id,//from passport params
		    app_name:req.body.app_name,
		    app_type:req.body.app_type,
	    	app_url:req.body.app_url
	  	});
	  	// console.log(req.user);
	  	newapp.save(function (err, post) {
		    if (err) { return next(err) }
		    // res.send(post);
	     	var string = encodeURIComponent('create-success');
  			res.redirect('/automation-panel?notice=' + string);
	  	});
	});
	/* check app name */
	router.post('/check-appname', function(req, res, next) {
		// if (req.isAuthenticated()){  
		// 	if(typeof(req.body.id) != undefined){
		// 		Newapp.find({'app_name':req.body.appname,'user_id':{$ne:req.user._id},'_id':{$ne:req.body.id}},function (err, app) {
		// 		  if (err) return console.error(err);
		// 		  res.send((app.length > 0) ? 'false': 'true' );
		// 		});
		// 	}else{
				Newapp.find({'app_name':req.body.appname},
				// 'user_id':{$ne:req.user._id}},
				function (err, app) {
				  if (err) return console.error(err);
				  res.send((app.length > 0) ? 'false': 'true' );
				});
		// 	}
			
		// }
		// else{
		// 	res.redirect('/');
	 //	}
	});
	
});
module.exports = router;
