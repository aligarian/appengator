var mongoose = require('mongoose');
var md5= require('md5');
var moment = require('moment');
var timestamps = require('mongoose-timestamp');
var appEvents = mongoose.Schema({
				    app_key : String,
				    e_key: String,
					e_name: String,
				});
appEvents.plugin(timestamps);

module.exports = mongoose.model('app_events', appEvents); 