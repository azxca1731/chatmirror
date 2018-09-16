var express = require('express');
var router = express.Router();
var isAuthenicated = require('../lib/isAuthenicated');
var Chat = require('../models/chat');

/* GET users listing. */
router.get('/',isAuthenicated, function(req, res, next) {
  res.render('chat', { title: 'ChatMirror', user:req.user });
});

router.get('/list',isAuthenicated, function(req, res, next) {
	Chat.find(function(err,chat){
		if(err) return res.status(500).send({error: 'database failure'});
		var list = chat.filter(chat=>chat.whisper_id===''||chat.whisper_id===req.user.name);
		res.json(list);
	});
});

module.exports = router;