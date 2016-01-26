var models = require('../models');
var BorrowingRecord = models.borrowingRecord;
var Book = models.Book;

exports.newAndSave = function(book_id,borrower_id,borrow_date,return_date,callback){
	Book.findOne({_id: book_id}, function(err, book){
		if(err || !book){
			return callback(err);
		}
		console.log(book.has_borrowed);
		book.has_borrowed = true;
		book.borrower_id = borrower_id;
		book.out_time = borrow_date;
		book.return_time = return_date;
		book.save(callback);
	});
	/*
	var record = new BorrowingRecord();
	record.book_id = book_id;
	record.borrower_id = borrower_id;
	record.borrow_date = borrow_date;
	record.return_date = return_date;
	record.has_returned = false;
	record.save(callback);
	*/
};

exports.returnBook = function(book_id,actual_return_date,callback){
	Book.findOne({_id: book_id}, function(err,book){
		if(err || !book){
			return callback(err);
		}
		book.has_borrowed = false;
		book.return_date = actual_return_date;
		book.save(callback);
	});

	/*
	BorrowingRecord.findOne({'book_id': book_id,'has_returned':false}, function(record){
		record.has_returned = true;
		record.actual_return_date = actual_return_date;
	});
*/
}

