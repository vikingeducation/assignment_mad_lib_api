const express = require("express");
const app = express();
const nouns = require('./routers/nouns');
const adjectives = require('./routers/adjectives');
const verbs = require('./routers/verbs');
const adverbs = require('./routers/adverbs');


// ----------------------------------------
// App Variables
// ----------------------------------------
app.locals.appName = "Mad Lib API";

// ----------------------------------------
// ENV
// ----------------------------------------
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "secret"]
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require("express-flash-messages");
app.use(flash());

// ----------------------------------------
// Method Override
// ----------------------------------------
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");

app.use(
  methodOverride(
    getPostSupport.callback,
    getPostSupport.options // { methods: ['POST', 'GET'] }
  )
);

// ----------------------------------------
// Referrer
// ----------------------------------------
app.use((req, res, next) => {
  req.session.backUrl = req.header("Referer") || "/";
  next();
});

// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);

app.use(morganToolkit());

// ----------------------------------------
// Passport
// ----------------------------------------
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
const BearerStrategy = require("passport-http-bearer").Strategy;
const User = require("./models/user");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/mad_lib");

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    // Find user by email
    User.findOne({ email: email })
      .then(user => {
        // The user is valid if the password is valid
        const isValid = user.validatePassword(password);

        // If the user is valid pass the user
        // to the done callback
        // Else pass false
        return done(null, isValid ? user : false);
      })
      .catch(e => done(null, false));
  })
);

const bearerStrategy = new BearerStrategy((token, done) => {

  // Find the user by token
  User.findOne({ token: token })
    .then(user => {

      // Pass the user if found else false
      return done(null, user || false);
    })
    .catch(e => done(null, false));
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const loggedInOnly = (req, res, next) => {
  return req.user ? next() : res.redirect('/login');
};

const loggedOutOnly = (req, res, next) => {
  return !req.user ? next() : res.redirect('/');
};




// ----------------------------------------
// Routes
// ----------------------------------------

app.use('/api/v1', wordsApi)

// Show login only if logged out
app.get('/login', loggedOutOnly, (req, res) => {
  res.render('sessions/new');
});

// Allow logout via GET and DELETE
const onLogout = (req, res) => {

  // Passport convenience method to logout
  req.logout();

  // Ensure always redirecting as GET
  req.method = 'GET';
  res.redirect('/login');
};


app.get('/logout', loggedInOnly, onLogout);
app.delete('/logout', loggedInOnly, onLogout);

app.get("/", async(req, res) => {
  if (req.user) {
    res.render("home", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);


app.post('/sessions', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

const usersRouter = require('./routers/users')({
  loggedInOnly,
  loggedOutOnly
});
app.use('/', usersRouter);


// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require("express-handlebars");
const helpers = require("./helpers");

const hbs = expressHandlebars.create({
  helpers: helpers,
  partialsDir: "views/",
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}\n`);
});

if (require.main === module) {
  app.listen.apply(app, args);
}

// ----------------------------------------
// Error Handling
// ----------------------------------------
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render("errors/500", { error: err });
});

module.exports = app;