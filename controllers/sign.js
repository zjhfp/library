var validator      = require('validator');
var eventproxy     = require('eventproxy');
var config         = require('../config');
var User           = require('../proxy').User;
var authMiddleWare = require('../middlewares/auth');

exports.showLogin = function (req, res) {
	console.log(req.session);
	req.session._loginReferer = req.headers.referer;
	res.render('sign/signin');
}

/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
  '/active_account', //active page
  '/reset_pass',     //reset password page, avoid to reset twice
  '/signup',         //regist page
  '/search_pass'    //serch pass page
];

exports.login = function (req, res, next) {
	var loginname = validator.trim(req.body.name).toLowerCase();
	var pass = validator.trim(req.body.pass);
	var ep = new eventproxy();

	ep.fail(next);

	if(!loginname || !pass) {
		res.status(422);
		return res.render('sign/signin', { error: '信息不完整。'});
	}

	var getUser = User.getUserByMobile;

	ep.on('login_error', function (login_error) {
		res.status(403);
		res.render('sign/signin', { error: '用户名或密码错误'});
	});

	getUser(loginname, function (err, user) {
		if (err) {
			return next(err);
		}

		if (!user) {
			return ep.emit('login_error');
		}

		authMiddleWare.gen_session(user, res);
		var refer = req.session._loginReferer || '/';
		for (var i=0, len = notJump.length; i !== len; i++) {
			if (refer.indexOf(notJump[i] >= 0)) {
				refer = '/';
				break;
			}
		}
		res.redirect(refer);
	});
};

exports.signout = function (req, res, next) {
	req.session.destory();
	res.clearCookie(config.auth_cookie_name, { path: '/'});
	res.redirect('/');
};