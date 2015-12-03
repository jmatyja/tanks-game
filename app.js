var express = require('express');
var path = require('path');

var logger = require('morgan');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session');

var MongoStore = require('connect-mongo')(session);
var mongoSessionStore = new MongoStore({ url: 'mongodb://localhost/test-app' });
var app = express();
app.set('sessionStore', mongoSessionStore);
var port = process.env.PORT || 8080;

var passport = require('passport');
var flash = require('connect-flash');

app.set('view engine', 'ejs');

require('./config/passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'sfsdf32',
    store: mongoSessionStore,
    proxy: true,
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session
var auth = require('./routes/auth')(passport);
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth.router);


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
