var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','html');
app.engine('.html', ejs.__express);
//app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//let options = {
//  setHeaders: function (res, path, stat) {
//    res.set('Access-Control-Allow-Origin', 'http://www.tellstorys.cn:8081')
//    res.set('Access-Control-Allow-Credentials', 'true')
//  }
//}
//app.use(express.static(path.join(__dirname, 'public'),options));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name:'x-player',
  secret: 'qMxCD5PcJspJm8fvNc0XW75lE7CTS7NtrsqKcTZWMW02dWZDI8AWfE9Tw0eusQKFw9cMvkdO0hzSi1ZD2LSy8odUfsPQKFPZHqA89piRvbTPgMgRRX8JSvLGJcquaEx6', // 建议使用 128 个字符的随机字符串
  cookie: { maxAge: 30 * 60 * 1000 }, //cookie生存周期20*60秒
  resave: true,  //cookie之间的请求规则,假设每次登陆，就算会话存在也重新保存一次
  saveUninitialized: true //强制保存未初始化的会话到存储器
}));  //这些是写在app.js里面的

//设置跨域访问
//app.all('*', function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "http://www.tellstorys.cn:8081");
//  res.header("Access-Control-Allow-Credentials", "true");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  //res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//  res.header("X-Powered-By",' 3.2.1')
//  //res.header("Content-Type", "application/json;charset=utf-8");
//  next();
//});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
