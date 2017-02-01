var mongoose = require('mongoose');
var md5= require('md5');
var moment = require('moment');
var timestamps = require('mongoose-timestamp');
var usersApp = mongoose.Schema({
    user_id: String,
    app_name: String,
    app_type: String,
    app_url: String,
    app_key: {type:String, default:md5(moment().unix())}
});
usersApp.plugin(timestamps);

module.exports = mongoose.model('apps', usersApp); 