const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const flash = require('express-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const connect = require('./mongo');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
const hbs = exphbs.create({
	defaultLayout: 'main'
});
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
	session({
		secret: process.env.SECRET || 'I like pickles',
		saveUninitialized: false,
		resave: false
	})
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	req.session.backUrl = req.header('Referer') || '/';
	next();
});

app.use(async (req, res, next) => {
	if (!mongoose.connection.readyState) {
		await connect();
	}
	next();
});

app.use('/', index);
app.use('/users', users);

app.use(async (req, res, next) => {
	if (mongoose.connection.readyState) {
		mongoose.disconnect();
	}
	next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
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
