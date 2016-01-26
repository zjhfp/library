var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BorrowingRecordSchema = new Schema({
	// 图书
	book_id: { type: ObjectId},
	// 借阅人
	borrower_id: { type: ObjectId},
	// 借阅时间
	borrow_date: { type: Date},
	// 应还时间
	return_date: { type: Date},
	// 实际还书时间
	actual_return_date: { type: Date},
	// 是否已还
	has_returned: { type: Boolean, default: false}
});

BorrowingRecordSchema.plugin(BaseModel);
//BorrowingRecordSchema.index({book_id:1,borrower_id:1});

mongoose.model('BorrowingRecord', BorrowingRecordSchema);