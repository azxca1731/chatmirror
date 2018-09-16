var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'ChatMirror', message: req.flash('loginMessage'), user:req.user });
});

router.post('/', passport.authenticate('login', {
    successRedirect : '/', 
    failureRedirect : '/login', //로그인 실패시 redirect할 url주소
    failureFlash : true 
}));

module.exports = router;