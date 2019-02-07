var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http=require('http');
var qs = require('querystring');
var session = require('express-session')

var index = require('./routes/index');
var users = require('./routes/users');
var io=require('./io/io');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'tech app',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use('/', index);
app.use('/users', users);

app.get('/video',function(req,res,next){
  console.log(req.body);
})
app.get('/login',function(req,res,next){
  console.log(req.body);
  res.sendFile(__dirname+'/public/login.html');
  // res.render('login');
})

app.get('/profile',function(req,res,next){
  console.log(req.session.user);
  res.json({"user":req.session.user});
  // res.render('login');
})
// app.post('/login',function(req,res,next){
//   console.log(req.body);
//   if(req.body.email){
//     io.emit('added',req.body.email);
//     res.redirect('/');
//   }
//
// })
app.post('/login',function(req,res,next){
  console.log(req.body);
  if(req.body.email){
    req.session.user=req.body.email;
    console.log(req.session);
    res.json({"user":req.body.email});
  }

})
var fs=require('fs');
app.post('/video',function(req,res,next){
  console.log(req.body);
  return "successful";
})
// app.get('/video',function(req,res,next){
// console.log(req);
// return "successful";
// })
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
