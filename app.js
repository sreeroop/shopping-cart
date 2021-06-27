var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var session = require('express-session')
var db = require('./config/connection')

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var hbs = require('express-handlebars')
var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname, '/views/layout/'), partialsDir: path.join(__dirname, 'views/partials/') }))

app.use(logger('dev'));
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "Key", cookie: { maxAge: 600000 }, resave: false, saveUninitialized: false }))
app.use(express.static(path.join(__dirname, 'public')));

db.connect((err) => {
  if (err) console.log(err)
  console.log("db connected")
})

app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
