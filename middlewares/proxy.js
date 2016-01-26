var urllib = require('url');
var request = require('request');

exports.proxy = function (req, res, next) {
	var url = decodeURIComponent(req.query.url);
	var hostname = urllib.parse(url).hostname;

	request.get({
		url: url,
		headers: {
			'If-Modified-Since': req.header('If-Modified-Since') || ''
		}
	}).on('response', function (response) {
		res.set(response.headers);
	}).on('error', function (err) {
		console.error(err);
	}).pipe(res);
};