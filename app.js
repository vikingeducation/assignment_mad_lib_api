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
const morgan = require('morgan');

const index = require('./routes/index');
const apiRouter = require('./routes/api/v1/api');

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'test') {
	app.use(morgan('tiny'));
}

app.use(
	session({
		secret: process.env.SECRET || 'I like pickles',
		saveUninitialized: false,
		resave: false
	})
);

app.use(flash());

const {
	local,
	bearer,
	deserializeUser,
	serializeUser
} = require('./strategies');
passport.use(local);
passport.use(bearer);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
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

const requireToken = passport.authenticate('bearer', {
	session: false
});


app.use('/api/v1', requireToken, apiRouter);
app.use('/', index);

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
