var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var showRouter = require('./routes/show');
var loginRouter = require('./routes/login');
var singupRouter = require('./routes/signup');
var chatRouter = require('./routes/chat');
var searchRouter = require('./routes/search');

var app = express();
app.io = require('socket.io')();
var io = app.io;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'mirror mirror',
    resave: true,
    saveUninitialized: false
}));

mongoose.connect('mongodb://localhost/mirrorchat');
mongoose.Promise = global.Promise; 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("mongo DB connected...");
});
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session()); 

app.use(flash());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', singupRouter);
app.use('/chat', chatRouter);
app.use('/search', searchRouter);
app.use('/show', showRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var login_ids = {};
var User = require('./models/user');
var Chat = require('./models/chat');

io.on('connection', function(socket){
	
	console.log('a user connected');
	
	socket.on('login', function(name){
		//매핑해주면 됨
		console.log(name);
		login_ids[name]=socket.id;
		console.log(login_ids);
	});
	
	socket.on('disconnect', function(){
    	console.log('user disconnected');
	});
	
	socket.on('whisper', function(chat){
		User.findOne({name:chat.to},function(err, user){
			if(err) return console.log(err);
			if(!user) return console.log('no user');
			console.log(user.id);
			console.log(login_ids[user.id]);
			io.to(login_ids[user.id]).emit('chat message',chat);
		});
		var chat_log = new Chat();
		chat_log.user=chat.user;
		chat_log.body=chat.body;
		chat_log.whisper_id=chat.to;
		chat_log.save(function(err){
			if(err){
				console.log(err);
				return;
			}
		});
	});
	
	socket.on('chat message', function(chat){
		var chat_log = new Chat();
		chat_log.user=chat.user;
		chat_log.body=chat.body;
		chat_log.whisper_id='';
		io.emit('chat message', chat);
		chat_log.save(function(err){
			if(err){
				console.log(err);
				return;
			}
		});
	});
});

module.exports = app;