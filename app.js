const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const { User } = require("./models");
const auth = require("./middleware/authentication");
const mongoose = require("mongoose");
const session = require("express-session");

//session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

app.use(bodyParser.urlencoded({ extended: true }));

//Passport Goodness
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;
const TokenStrategy = require("passport-http-bearer").Strategy;

const localStrategy = new LocalStrategy(
  {
    usernameField: "email"
  },
  (email, password, done) => {
    User.findOne({
      email: email
    })
      .then(user => {
        const valid = user && user.validPassword(password);
        return done(null, valid ? user : false);
      })
      .catch(e => {
        console.log(e);
        done(null, false);
      });
  }
);

const tokenStrategy = new TokenStrategy((token, done) => {
  User.findOne({
    token: token
  })
    .then(user => {
      return done(null, user || false);
    })
    .catch(e => {
      done(null, false);
    });
});
passport.use(localStrategy);
passport.use(tokenStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(e => {
      done(null, false);
    });
});

//HANDLEBARS
const hbs = require("express-handlebars");

app.engine("handlebars", hbs.create({ defaultLayout: "main" }).engine);
app.set("view engine", "handlebars");

//show a user signed in
app.get("/", auth.isLoggedIn, (req, res) => {
  res.render("./users/index", { user: req.user });
});

app.get("/login", auth.isLoggedOut, (req, res) => {
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

app.get("/signup", auth.isLoggedOut, (req, res) => {
  res.render("signup");
});
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const apiRouter = require("./routes/madlibs");

app.use(
  "/api/v1",
  passport.authenticate("bearer", { session: false }),
  apiRouter
);

if (require.main === module) {
  app.listen(3000, () => {
    console.log("Now listening...");
  });
}

module.exports = app;
