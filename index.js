const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const exphbs = require("express-handlebars");

const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("./session/Session.js");

var flash = require("express-flash-messages");
app.use(flash());
var payOut = require("./moneyLogic");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));
app.use(
  expressSession({
    secret: process.env.secret || "keyboard cat",
    saveUninitialized: false,
    resave: false
  })
);

app.engine(
  "handlebars",
  exphbs({ defaultLayout: "main", partialsDir: "views/partials" })
);
app.set("view engine", "handlebars");
app.use(loginMiddleware);
const User = require("./models/User");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/project_ponz");

app.get("/", loggedInOnly, (req, res) => {});
app.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});

app.get("/logout", loggedInOnly, (req, res) => {
  res.cookie("sessionId", "");
  res.redirect("/");
});

app.post("/login", loggedOutOnly, (req, res) => {
  User.findOne({ username: req.body.username }).then(foundUser => {
    if (foundUser === null) {
      return res.redirect("/login");
    }
    if (foundUser.validatePassword(req.body.password)) {
      const sessionId = createSignedSessionId(foundUser.username);
      res.cookie("sessionId", sessionId);
      return res.redirect("/");
    } else {
      return res.redirect("/login");
    }
  });
});

app.listen(3000, "0.0.0.0", (req, res) => {
  console.log("listening on port 3000");
});
