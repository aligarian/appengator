var mongoose = require('mongoose');
// var md5= require('md5');
// var moment = require('moment');
// var timestamps = require('mongoose-timestamp');
var appEventActivity = mongoose.Schema({
				    app_key : String,
					e_id:String,//event id from appEvent
					u_imei:String,//user imei from appUsers
					startAt:{type: Date, default : Date.now()},
					endAt:{type: Date, default : Date.now()}
				});
// appEventActivity.plugin(timestamps);

module.exports = mongoose.model('app_event_activity', appEventActivity); 