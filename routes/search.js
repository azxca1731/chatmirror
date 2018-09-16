var express = require('express');
var router = express.Router();
var isAuthenicated = require('../lib/isAuthenicated');
var multer = require('multer');
var fs = require('fs-extra');
var fileWalker = require('../lib/reculsiveFIle');
var AdmZip = require('adm-zip');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
	var path = `uploads/${req.user.id}`;  
	fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

router.get('/',isAuthenicated, function(req, res, next) {
	res.render('search', { title: 'ChatMirror', user: req.user, message: req.flash('uploadMessage')});
});

router.post('/',upload.single('userfile'),function(req, res){
	console.log(req.file);
	var origname = req.file.filename;
	var extension = origname.substring(origname.length - 3);
	if(extension==="zip"||extension==="tar"){//뒤에서 3글자를 확인하여 압축되어있는지 확인
		var path="/workspace/mirrorchat/uploads/"+req.user.id;
		var zip = new AdmZip(path+"/"+origname);
		console.log(origname.slice(0,-4));
		fs.mkdirsSync(path+"/"+origname.slice(0,-4));
		zip.extractAllTo(path+"/"+origname.slice(0,-4), true);
		fs.unlink(path+"/"+origname, (err) => {
			if (err) throw err;
			console.log('file was deleted');
		});
	}
	req.flash('uploadMessage', '파일을 올렸습니다.');
	res.redirect('/search');
});

router.get('/index',isAuthenicated, function(req, res){
	var path="/workspace/mirrorchat/uploads/"+req.user.id;
	fileWalker(path,(err, data) => {
		if(err){
			console.log(err);
			if(err.errno===-2){
				req.flash('uploadMessage', '파일을 하나도 올리지 않았습니다.');
				res.redirect('/search');
			}
			return;
		}
		var showData=data.map(str => str.substring(55));
		res.render('dir',{title: 'chatMirror', user: req.user, data:showData});
	});

});

router.get('/zip',function(req,res){
	res.json({hello:'hello'});
});

module.exports = router;