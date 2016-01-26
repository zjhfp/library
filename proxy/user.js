var models = require('../models');
var User = models.User;
var utility = require('utility');
var uuid = require('node-uuid');

exports.getUserByMobile = function (mobile, callback) {
	console.log(mobile);
	User.findOne({'mobile': mobile},callback);
}

exports.getUserById = function (id, callback) {
	User.findOne({_id: id}, callback);
}

exports.newAndSave = function (name, loginname, pass, is_block, mobile ,callback){
	var user = new User();
	user.name = name;
	user.loginname = loginname;
	user.pass = pass;
	user.is_block = is_block || false;
	user.mobile = mobile;
	user.save(callback);
}

exports.find = function(query, str, options, callback){
	User.find(query, str, options, callback);
}

exports.findAll = function(callback) {
	User.find(callback);
}