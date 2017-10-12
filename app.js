const express = require("express");
const app = express();

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
    keys: [process.env.SESSION_SECRET || "asdf1234567890qwer"]
  })
);

app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
});

// ----------------------------------------
// Method Override
// ----------------------------------------
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");

app.use(
  methodOverride(
    getPostSupport.callback,
    getPostSupport.options // GET POST
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
// Logging
// ----------------------------------------
const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);

// Use morgan middleware with
// custom format
if (process.env.NODE_ENV !== "test") {
  app.use(morganToolkit());
}

// ----------------------------------------
// Mongoose
// ----------------------------------------
const mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

// ----------------------------------------
// Services
// ----------------------------------------

// Require passport, strategies and User model
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const User = require("./models").User;

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Create local strategy
const localStrategy = new LocalStrategy(
  {
    // Set username field to email
    // to match form
    usernameField: "email"
  },
  (email, password, done) => {
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
  }
);

// Create the token bearer strategy
const bearerStrategy = new BearerStrategy((token, done) => {
  // Find the user by token
  User.findOne({ token: token })
    .then(user => {
      // Pass the user if found else false
      return done(null, user || false);
    })
    .catch(e => done(null, false));
});

// Use the strategy middlewares
passport.use(localStrategy);
passport.use(bearerStrategy);

// Serialize and deserialize the user
// with the user ID
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  // Find the user in the database
  User.findById(id)
    .then(user => done(null, user))
    .catch(e => done(null, false));
});

// ----------------------------------------
// Session Helper Middlewares
// ----------------------------------------

// Set up middleware to allow/disallow login/logout
const loggedInOnly = (req, res, next) => {
  return req.user ? next() : res.redirect("/login");
};

const loggedOutOnly = (req, res, next) => {
  return !req.user ? next() : res.redirect("/");
};

// ----------------------------------------
// Routes
// ----------------------------------------

// Show login only if logged out
app.get("/login", loggedOutOnly, (req, res) => {
  res.render("login/login");
});

// Allow logout via GET and DELETE
const onLogout = (req, res) => {
  // Passport convenience method to logout
  req.logout();

  // Ensure always redirecting as GET
  req.method = "GET";
  res.redirect("/login");
};
app.get("/logout", loggedInOnly, onLogout);
app.delete("/logout", loggedInOnly, onLogout);

// Create session with passport
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

// Pass logged in/out middlewares to users router
const loginRouter = require("./routers/login")({
  loggedInOnly,
  loggedOutOnly
});
app.use("/", loginRouter);

const madLibRouter = require("./routers/madLib");
app.use("/api/v1", madLibRouter);

// Setup API router
// const furiousSpinoffsRouter = require('./routers/furious_spinoffs');
// app.use('/api/v1', furiousSpinoffsRouter);

// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require("express-handlebars");

const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT || process.argv[2] || 4000;
const host = "localhost";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}\n`);
});

// If we're running this file directly
// start up the server
if (require.main === module) {
  app.listen.apply(app, args);
}

// ----------------------------------------
// Error Handling
// ----------------------------------------
app.use("/api", (err, req, res, next) => {
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
  res.status(500).render("errors/500", { error: err });
});

module.exports = app;
