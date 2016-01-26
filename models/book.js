var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BookSchema = new Schema({
	// 书名
	name: { type: String},
	// 作者
	author: { type: String},
	// 是否已借出
	has_borrowed: { type: Boolean, default: false},
	// 序列号
	serial: { type: String},
	// 借阅人
	borrower_id: { type: ObjectId},
	// 借出时间
	out_time: { type: Date},
	// 归还时间
	return_time: { type: Date},
	// 版本号
	version: { type: String}
});

BookSchema.plugin(BaseModel);
BookSchema.index({serial:1},{unique: true});

mongoose.model('Book', BookSchema);