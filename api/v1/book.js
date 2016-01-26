var models = require('../../models');
var BookModel = models.Book;
var UserModel = models.User;
var eventproxy   = require('eventproxy');

exports.index = function(req, res, next) {
	var page = parseInt(req.query.page, 10) || 1;
	page = page > 0 ? page : 1;
	var limit = Number(req.query.limit) || config.list_book_count;

	var query = {};

	var ep = new eventproxy();
	ep.fail(next);
	var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -name'};

	BookModel.find(query, '', options, ep.done('books'));

	ep.all('books', function (books) {
		books.forEach(function (book) {
			UserModel.findById(book.borrower_id, ep.done(function (user) {
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
}