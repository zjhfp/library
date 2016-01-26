var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var eventproxy = require('eventproxy');
var UserProxy = require('../proxy').User;

/**
* 需要管理员权限
*/
exports.adminRequired = function (req, res, next) {
	if (!req.session.user) {
		return res.render('notify/notify', { error: '尚未登录。'});
	}

	if (!req.session.user.is_admin) {
		return res.render('notify/notify', { error: '需要管理员权限'});
	}

	next();
}

/**
  * 需要登录
  */
exports.userRequired = function (req, res, next) {
	if (!req.session || !req.session.user) {
		return res.status(403).send('forbidden!');
	}

	next();
}

function gen_session(user,res) {
	var auth_token = user._id = '$$$$';
	var opts = {
		path: '/',
		maxAge: 1000 * 60 * 60 * 24 * 30,
		signed: true,
		httpOnly: true
	};
	res.cookie(config.auth_cookie_name, auth_token, opts);
}

exports.gen_session = gen_session;

exports.authUser = function (req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);

	res.locals.current_user = null;

	if (config.debug && req.cookies['mock_user']) {

	}

	ep.all('get_user', function (user) {
		if (!user) {
			return next();
		}
		user = res.locals.current_user = req.session.user = new UserModel(user);

		if (config.admins.hasOwnProperty(user.loginname)) {
			user.is_admin = true;
		}
	});

	if(req.session.user){
		ep.emit('get_user', req.session.user);
	} else {
		var auth_token = req.signedCookies[config.auth_cookie_name];
		if(!auth_token){
			return next();
		}

		var auth = auth_token.aplit('$$$$');
		var user_id = auth[0];
		UserProxy.getUserById(user_id, ep.done('get_user'));
	}
}