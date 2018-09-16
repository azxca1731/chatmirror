var express = require('express');
var router = express.Router();
var isAuthenicated = require('../lib/isAuthenicated');
var fs = require('fs-extra');

router.get('/dir/*',isAuthenicated, function(req, res, next) {
	var fileName=req.path.substring(5);
	console.log(fileName);
	res.render('show', { title: 'ChatMirror', user: req.user, file:fileName});
});

/*router.get('/:fileName',isAuthenicated, function(req, res, next) {
	var fileName=req.params.fileName;
	console.log(fileName);
	res.render('show', { title: 'ChatMirror', user: req.user, file:fileName});
});*/

router.get('/get/*',isAuthenicated, function(req, res, next) {
	var path="/workspace/mirrorchat/uploads/"+req.user.id;
	var fileName=req.path.substring(5);
	path+='/'+fileName;
	console.log(path);
	fs.readFile(path, 'utf-8', function(error, data) {
    	console.log('01 readAsync: %s',data);
		res.send(data);
	});
});

router.post('/put',isAuthenicated, function(req, res, next) {
	var path="/workspace/mirrorchat/uploads/"+req.user.id;
	var fileName=req.body.file;
	var data=req.body.data;
	path+='/'+fileName;

	fs.writeFile(path, data, 'utf-8', function(e){
		if(e){
			// 3. 파일생성 중 오류가 발생하면 오류출력
			console.log(e);
		}else{
			// 4. 파일생성 중 오류가 없으면 완료 문자열 출력
			console.log('01 WRITE DONE!');
		}
	});
});

module.exports = router;