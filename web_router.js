var express = require('express');
var sign = require('./controllers/sign');
var site = require('./controllers/site');
var book = require('./controllers/book');
var user = require('./controllers/user');

var router = express.Router();

router.get('/', book.showList);

router.get('/signin', sign.showLogin);
router.post('/signin', sign.login);
router.post('/signout', sign.signout);

router.get('/book/list', book.showList);
router.post('/book/list', book.list);

router.get('/book/add', book.showAdd);
router.post('/book/add', book.add);
router.post('/book/borrow', book.borrow);
router.get('/book/return', book.returnBook);

router.get('/user/add', user.showAdd);
router.post('/user/add', user.add);

router.get('/user/list', user.showList);
module.exports = router;