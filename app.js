var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    TwitterStrategy = require('passport-twitter'),
    GoogleStrategy = require('passport-google'),
    FacebookStrategy = require('passport-facebook'),
    mongoose = require('mongoose');
    // multer= require('multer');
mongoose.connect('mongodb://localhost/appengator');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');
var usersapp = require('./routes/users-app');
var ws = require('./routes/ws');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
//session persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;
  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});
/*Configure the multer.*/


// app.use(multer({ dest: './uploads/',
// rename: function (fieldname, filename) {
//     return filename+Date.now();
//   },
// onFileUploadStart: function (file) {
//   console.log(file.originalname + ' is starting ...')
// },
// onFileUploadComplete: function (file) {
//   console.log(file.fieldname + ' uploaded to  ' + file.path)
//   done=true;
// }
// }));
// app.post('/api/photo',function(req,res){
//   if(done==true){
//     console.log(req.files);
//     res.end("File uploaded.");
//   }
// });

app.use('/', routes);
app.use('/automation-panel', users);
app.use('/login', login);
app.use('/logout', logout);
app.use('/app', usersapp);
app.use('/ws',ws);

// app.use('/app-delete', newapp);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
