var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'ChatMirror', message: req.flash('signupMessage'), user:req.user });
});

router.post('/', passport.authenticate('signup', {
    successRedirect : '/', 
    failureRedirect : '/signup', //가입 실패시 redirect할 url주소
    failureFlash : true 
}));

module.exports = router;