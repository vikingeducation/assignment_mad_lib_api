const express = require("express");
const app = express();

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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// ----------------------------------------
// Routes
// ----------------------------------------

app.get("/", async (req, res) => {
  if (req.user) {
    res.render("home", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
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

app.post("/register", async function(req, res, next) {
  const { password, email, fname, lname } = req.body;
  const user = new User({ password, fname, lname, email });
  try {
    let savedUser = await user.save();
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  } catch (e) {
    console.log(e);
  }
});

// 5
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

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

