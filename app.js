const express = require("express");
const app = express();
const models = require("./models");
const User = require("./models/user");
const addUser = require("./addUser");

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
// passport
// ----------------------------------------
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
app.use(passport.initialize());

// ----------------------------------------
// local strategy
// ----------------------------------------

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) return done(err);
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: "Invalid email/password" });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// ----------------------------------------
// bearer strategy
// ----------------------------------------

const bearerStrategy = new BearerStrategy((token, done) => {
  // Find the user by token
  User.findOne({ token: token })
    .then(user => {
      // Pass the user if found else false
      return done(null, user || false);
    })
    .catch(e => done(null, false));
});

// ----------------------------------------
// passport validate
// ----------------------------------------

app.post(
  "/sessions",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

// ----------------------------------------
// session
// ----------------------------------------
const session = require("express-session");
app.use(passport.session());

// ----------------------------------------
// mongoose
// ----------------------------------------
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/assignment_mad_lib_api_development");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});
// ----------------------------------------
// sentencer
// ----------------------------------------
const sentencer = require("sentencer");

// ----------------------------------------
// wordpos
// ----------------------------------------
const wordpos = require("wordpos");

// ----------------------------------------
// login/logout middleware
// ----------------------------------------

const loggedInOnly = (req, res, next) => {
  return req.user ? next() : res.redirect("/login");
};

const loggedOutOnly = (req, res, next) => {
  return !req.user ? next() : res.redirect("/");
};

// ----------------------------------------
// Routes
// ----------------------------------------
app.get("/", loggedInOnly, async (req, res) => {
  try {
    let currentUser = await User.findById(req.session.passport.user);
    res.render("welcome/index", {
      currentUser: currentUser
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.post("/register", async (req, res, next) => {
  const { fname, lname, email, password } = req.body;
  await addUser(fname, lname, email, password, next);
  res.redirect("/login");
});

app.get("/register", loggedOutOnly, (req, res) => {
  res.render("register");
});

const onLogout = (req, res) => {
  req.logout();
  req.method = "GET";
  res.redirect("/login");
};

app.get("/logout", loggedInOnly, onLogout);
app.delete("/logout", loggedInOnly, onLogout);

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
