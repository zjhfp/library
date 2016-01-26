var path = require('path');

var config = {
	mini_assets: false,
	site_static_host: '',
	host: 'localhost',
	db: 'mongodb://127.0.0.1/libiary',

	session_secret: 'libiary_secret',
	auth_cookie_name: 'libiary_cookie',

	port: 3000,

	list_book_count : 10,

	defaultBorrowDays : 7
}

module.exports = config;