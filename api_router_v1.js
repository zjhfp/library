var express = require('express');
var bookController = require('./api/v1/book');

var router = express.Router();

router.get('/books', bookController.index);

module.exports = router;