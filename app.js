var config = require('./config');

require('colors');
var path = require('path');
var Loader = require('loader');
var express = require('express');
var session = require('express-session');
var compress = require('compression');

require('./middlewares/mongoose_log');
require('./models');
var webRouter = require('./web_router');
//var apiRouterV1 = require('./api_router_v1');
var auth = require('./middlewares/auth');
var proxyMiddleware = require('./middlewares/proxy');
var _ = require('lodash');
var csurf = require('csurf');
var bodyParse = require('body-parser');
var busboy = require('connect-busboy');
var cors = require('cors');
var requestLog = require('./middlewares/request_log');
var logger = require('./common/logger');
var helmet = require('helmet');

// 静态文件目录
var staticDir = path.join(__dirname, 'public');
var assets = {};

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';
app.enable('trust proxy');

app.use(requestLog);

// 静态资源
//app.use(Loader.less(__dirname));
app.use('/public', express.static(staticDir));
app.use('/agent', proxyMiddleware.proxy);

// 通用中间件
app.use(require('response-time')());
app.use(helmet.frameguard('sameorigin'));
app.use(bodyParse.json({limit: '1mb'}));
app.use(bodyParse.urlencoded({ extended: true, limit: '1mb'}));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
	secret: config.session_secret,
	resave: true,
	saveUninitialized: true
}));
/*
if (!config.debug) {
	app.use(function (req, res, next) {
		if (req.path === '/api' || req.path.indexOf('api') === -1){
			csurf()(req, res, next);
			return;
		}
		next();
	});
	app.set('view cache', true);
}
*/
_.extend(app.locals, {
	config: config,
	Loader: Loader,
	assets: assets
});

app.use(busboy({
	limits: {
		fileSize: 10 * 1024 * 1024
	}
}));

//app.use('api/v1', cors(), apiRouterV1);
app.use('/', webRouter);

app.use(function (err, req, res, next) {
	console.error('server 500 error:', err);
	return res.status(500).send('500 status');
});

app.listen(config.port, function () {
	console.log('libiary listening on port', config.port);
	console.log('You can debug your app with http://' + config.hostname + ':' + config.port);
	console.log('');
});

module.exports = app;