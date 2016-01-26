var validator  = require('validator');
var _          = require('lodash');
var EventProxy = require('eventproxy');
var User 	   = require('../proxy').User;

exports.add = function (req, res, next) {
	var name = req.body.user_name;
	var loginname = req.body.loginname;
	var mobile = req.body.mobile;
	var pass = req.body.pass;
	mobile = validator.trim(mobile);
	if (mobile === '') {
		return res.status(422).send('手机号不能为空！');
	}
	loginname = validator.trim(loginname);
	if(loginname === ''){
		loginname = mobile;
	}
	var ep = new EventProxy();
	ep.fail(next);

	User.newAndSave(name, loginname, pass, false, mobile, ep.done('saveuser'));

	ep.all('saveuser', function (user) {
		return res.render('user/edit',{
			user : user
		});
	});
}

exports.showAdd = function (req, res, next) {
	return res.render('user/edit');
}

exports.showList = function (req, res, next) {
	User.findAll(function(users){
		console.log(users);
		res.render('user/userlist',{
			users: users
		});
	});
}