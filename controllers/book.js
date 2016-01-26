var validator  = require('validator');
var _          = require('lodash');
var EventProxy = require('eventproxy');
var Book       = require('../proxy').Book;
var User 	   = require('../proxy').User;
var BorrowingRecord = require('../proxy').BorrowingRecord;
var config 	   = require('../config');

exports.add = function (req, res, next) {
	var name = req.body.book_name;
	var author = req.body.book_author;
	var serial = req.body.book_serial;
	var version = req.body.book_version;
	name = validator.trim(name);
	if (name === '') {
		return res.status(422).send('书名不能为空!');
	}

	serial = validator.trim(serial);
	if (serial === '') {
		return res.status(422).send('序列号不能为空!');
	}

	var ep = EventProxy.create();
	ep.fail(next);

	Book.getBookByserial(serial, ep.doneLater(function(book){
		if(book){
			return res.status(403).send('该书已存在');
		}
	}));
	Book.newAndSave(name, author, serial, version, function(book){
		ep.emit('book_saved',book);
	});

	ap.all('book_saved', function (book) {
		res.redirect('book/list');
	});
};

exports.list = function (req, res, next) {
	var page = parseInt(req.query.page, 10) || 1;
	page = page > 0 ? page : 1;
	var limit = Number(req.query.limit) || config.list_book_count;

	var query = {};

	var ep = new EventProxy();
	ep.fail(next);
	var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -name'};

	Book.find(query, '', options, ep.done('books'));

	ep.all('books', function (books) {
		books.forEach(function (book) {
			User.getUserById(book.borrower_id, ep.done(function (user) {
				book.borrower = _.pick(user, ['name','mobile']);
				ep.emit('borrower');
			}));
		});

		ep.after('borrower', books.length, function () {
			books = books.map(function (book) {
				return _.pick(book, ['id','name','author','has_borrowed',
					'serial','borrower','out_time','return_time','version']);

				res.send({data: books});
			});
		})
	});
};

exports.showList = function (req, res, next) {
	var page = parseInt(req.query.page, 10) || 1;
	page = page > 0 ? page : 1;
	var limit = Number(req.query.limit) || config.list_book_count;

	var query = {};

	var ep = new EventProxy();
	ep.fail(next);
	var options = { skip: (page - 1) * limit, limit: limit, sort: '-name'};
	Book.find(query, '', options, ep.done('books'));

	ep.all('books', function (books) {
		books.forEach(function (book) {
			User.getUserById(book.borrower_id, ep.done(function (user) {
				book.borrower = _.pick(user, ['name','mobile']);
				ep.emit('borrower');
			}));
		});

		ep.after('borrower', books.length, function () {
			books = books.map(function (book) {
				return _.pick(book, ['id','name','author','has_borrowed',
					'serial','borrower','out_time','return_time','version']);
			});
			res.render('book/booklist',{
					books : books
				});
		})
	});
	
}

exports.showAdd = function (req, res, next) {
	res.render('book/edit');
}

exports.borrow = function (req, res, next) {
	var bookId = req.body.book_id;
	var user_mobile = req.body.user_mobile;
	user_mobile = validator.trim(user_mobile);
	if(user_mobile === ''){
		return res.status(422).send('借阅人不能为空');
	}
	var ep = new EventProxy();
	ep.fail(next);

	User.getUserByMobile(user_mobile, ep.done('getUser'));

	ep.all('getUser', function(user){
		if(!user){
			return res.status(422).send('用户不存在');
		}
		var now = new Date();
		BorrowingRecord.newAndSave(bookId,user.id,now,now, ep.done('save'));
	});

	ep.all('save', function(){
		res.redirect('/');
	})
}

exports.returnBook = function (req, res, next) {
	var book_id = req.query.book_id;
	var ep = new EventProxy();
	ep.fail(next);
	BorrowingRecord.returnBook(book_id,new Date(),ep.done(function(){
		res.send({
			success : true
		});
	}));
}

exports.showBorrowRecord = function (req, res, next) {
	var book_id = req.query.book_id;
	var ep = new EventProxy();
	ep.fail(next);

	BorrowingRecord.listRecords(book_id, ep.done(function(records){
		res.render("book/borrowHistory",{
			records: records
		});
	}));
}
