var express = require('express');
var router = express.Router();
var md5 = require('md5');
var moment = require('moment');
var async = require('async');
var timestamps = require('mongoose-timestamp');
var Newapp = require('./../model/usersApp.js');
var Appusers = require('./../model/appUsers.js');
var Appevents =	require('./../model/appEvents.js');
var AppEventActivity =require('./../model/appEventActivity.js');
var mongoose = require('mongoose');
var mongoURI = "mongodb://localhost:27017/appengator";
var db = mongoose.createConnection(mongoURI);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {	
	router.get('/app_install', function(req, res, next) {
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

	//webservice api for application installation
	router.post('/app_install', function(req,res,next){
		//console.log(req.body);
	    Newapp.find({'app_key':req.body.app_key },'app_key',function (err, app) {
            //console.log(app);
            if (err || app.length == null)
            { 
            	return console.log("Error:"+err +"\n\nApp:"+app);
            }
            else
            {
            	// Convert the Model instance to a simple object using Model's 'toObject' function
				// to prevent weirdness like infinite looping...
				// var upsertData = Appuser.toObject();
            	var upsertData ={
            		$set : {
            		app_key:req.body.app_key,
	            	imei: req.body.imei,
	            	imse: req.body.imse,
	            	device_model: req.body.device_model,
	            	android_version: req.body.android_version,
	            	kernel_version: req.body.kernel_version,
	            	build_number: req.body.build_number,
	            	lang: req.body.lang,
	            	device_id: req.body.device_id,
	            	height: req.body.height,
	            	width: req.body.width,
	            	timezone: req.body.timezone,	
	            	camera_pixel: req.body.camera_pixel,
	            	latitude:req.body.latitude,
	            	longitude:req.body.longitude,
	            	social_media_info: req.body.social_media_info,
	            	install_flag : 1
	            },
	            $inc : {user_count:1}};
	    	  	// Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
				delete upsertData._id;
				
				// Do the upsert, which works like this: If no Contact document exists with 
				// _id = contact.id, then create a new doc using upsertData.
				// Otherwise, update the existing doc with upsertData
				Appusers.update({imei: req.body.imei, app_key: req.body.app_key}, upsertData, {upsert: true}, function(err, data){ 
					if(err) return console.log(err);
					Appevents.find({app_key:req.body.app_key},'app_key',function(err, events){
						console.log(events);
						//console.log(req.body.app_events);
						if(err ){
							return console.log(err);
						}
						var i = 0;
						var bulk = Appevents.collection.initializeOrderedBulkOp();
						
						async.whilst(
						  function() { return i < req.body.app_events.length; },
						  function(callback) {
						    console.log(req.body.app_events[i].event_key);
						
						    bulk.find(
						      { app_key: req.body.app_key, e_key:req.body.app_events[i].event_key}
						    ).upsert().updateOne({
						      $set : {
						        app_key:req.body.app_key,
						        e_key: req.body.app_events[i].event_key,
						        e_name: req.body.app_events[i].event_name
						      }
						    });
						    i++;
						
						    if ( i % 1000 == 0) {
						      bulk.execute(function(err,response) {
						        if (err) console.log(err);
						        console.log(response);
						        bulk = Appevents.collection.initializeOrderedBulkOp();
						        callback();
						      })
						    } else {
						      callback();
						    }
						
						  },
						  function(err) {
						    if (err)
						      console.log(err);
						    else {
						      if ( i % 1000 != 0 )
						        bulk.execute(function(err,response) { 
						          if (err) console.log(err);
						          console.log(response);
						          // done
						        });
						      //else
						        // done
						    }
						
						  }
						);
					});
					res.send(data);
				});
				
				
	    	  	// Appusers.save(function (err, post) {
    		  	//  if (err) { return next(err) }
	    		    
	    		    
    		  	//  // res.send(post);
	    	   	//  	// var string = encodeURIComponent('create-success');
	      		// 	// res.redirect('/automation-panel?notice=' + string);
	    	  	// });
	            // res.render('users/app-edit', { title: 'Express', app:app[0]});
            }
         	
	    });
	});
	//for start an event
	router.post('/startEvent', function(req, res, next) {
		Appevents.find({app_key:req.body.app_key, e_name:req.body.event_name},'_id,app_key, e_name', function(err, eventData){
	    	if(err)return console.log(err);
	    	if(eventData[0] != "undefined"){
	    		Appusers.find({app_key:req.body.app_key, imei:req.body.imei}, '_id, imei', function(err, app) {
	    		    if(err) return console.log(err);
	    		    if(app[0]!= 'undefined'){
	    		    	var insertAppEvent = new AppEventActivity({app_key:req.body.app_key, e_id: eventData._id, u_imei:req.body.imei});
	    		    	insertAppEvent.save(function(err,data){
	    		    		if (err) {
								return console.log(err);
							}
							else {
							  res.send(data._id);
							}
	    		    	});
						
	    		    }
	    		});
	    	}
	    });
	});
	//for end an event
	router.post('/endEvent', function(req, res, next) {
	    AppEventActivity.findOneAndUpdate(
										   { "_id": req.body.event_key},
										   { "$currentDate" : { "endAt": true} },
										   { "new": true },
										   function(err,data){
											      if(err)console.log(err);
											      res.send(data);
										  });
	});
});
module.exports = router;