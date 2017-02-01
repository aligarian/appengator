var mongoose = require('mongoose');
var md5= require('md5');
var moment = require('moment');
var timestamps = require('mongoose-timestamp');
var appUsers = mongoose.Schema({
					    app_key : String,
						imei: String,
						imse: String,
						device_model: String,
						android_version: String,
						kernel_version: String,
						build_number: String,
						language: String,
						device_id: String,
						height: String,
						width: String,
						timezone: String,
						camera_pixel: String,
						latitude:String,
						longitude:String,
						social_media_info: String,
						user_count : {type : Number, default: 0},// count of installation on same device
						install_flag : Number// installation and uninstallation flagg - if install then value will be 1 and add 1 to user_count if uninstall then value will 0 and minus 1 from user_count. 
				});
appUsers.plugin(timestamps);

module.exports = mongoose.model('app_users', appUsers); 