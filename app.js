const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.locals.siteTitle = 'Mad Lib API';
  next();
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const cookieSession = require('cookie-session');

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'asdf1234567890qwer']
  })
);

app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
});

const flash = require('express-flash-messages');
app.use(flash());

const methodOverride = require('method-override');
const getPostSupport = require('express-method-override-get-post-support');

app.use(methodOverride(getPostSupport.callback, getPostSupport.options));

app.use((req, res, next) => {
  req.session.backUrl = req.header('Referer') || '/';
  next();
});

const morgan = require('morgan');
const morganToolkit = require('morgan-toolkit')(morgan);

// Use morgan middleware with custom format
if (process.env.NODE_ENV !== 'test') {
  app.use(morganToolkit());
}

const mongoose = require('mongoose');
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require('./mongo')().then(() => next());
  }
});

// Services
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const User = require('./models').User;

app.use(passport.initialize());
app.use(passport.session());

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email'
  },
  (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        const isValid = user.validatePassword(password);

        return done(null, isValid ? user : false);
      })
      .catch(e => done(null, false));
  }
);

const bearerStrategy = new BearerStrategy((token, done) => {
  User.findOne({ token })
    .then(user => {
      return done(null, user || false);
    })
    .catch(e => done(null, false));
});

passport.use(localStrategy);
passport.use(bearerStrategy);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(e => done(null, false));
});

// Session helper middleware
const loggedInOnly = (req, res, next) => {
  return req.user ? next() : res.redirect('/login');
};

const loggedOutOnly = (req, res, next) => {
  return !req.user ? next() : res.redirect('/');
};

// Routes
app.get('/login', loggedOutOnly, (req, res) => {
  res.render('sessions/new');
});

const onLogout = (req, res) => {
  req.logout();
  req.method = 'GET';
  res.redirect('/login');
};

app.get('/logout', loggedInOnly, onLogout);
app.delete('/logout', loggedInOnly, onLogout);

app.post(
  '/sessions',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

const usersRouter = require('./controllers/users')({
  loggedInOnly,
  loggedOutOnly
});
app.use('/', usersRouter);

// Setup API router

const expressHandlebars = require('express-handlebars');
const helpers = require('./helpers');

const hbs = expressHandlebars.create({
  partialsDir: 'views/',
  defaultLayout: 'application',
  helpers: helpers
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const port = process.env.PORT || process.argv[2] || 3000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

if (require.main === module) {
  app.listen.apply(app, args);
}

// Error handling
app.use('/api', (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).json({ error: err });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render('errors/500', { error: err });
});

module.exports = app;
