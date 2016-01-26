var models = require('../models');
var Book = models.Book;

exports.newAndSave = function(name, author, serial, version, callback){
	var book = new Book();
	book.name = name;
	book.author = author;
	book.serial = serial;
	book.version = version;
	book.has_borrowed = false;
	book.save(callback);
}

exports.getBookByserial = function (serial, callback) {
	Book.findOne({'serial': serial}, callback);
}

exports.find = function(query, str, options, callback){
	Book.find(query, str, options, callback);
}