const router = require("express").Router();
const {
  createSignedSessionId,
  loggedInOnly,
  loggedOutOnly
} = require("../session/Session.js");
const { User } = require("../models");

router.get("/", loggedInOnly, (req, res) => {
  res.render("landing/index");
});

router.get("/login", loggedOutOnly, (req, res) => {
  res.render("login/index");
});

router.get("/logout", loggedInOnly, (req, res) => {
  res.cookie("sessionId", "");
  res.redirect("/");
});

router.post("/login", loggedOutOnly, (req, res) => {
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

module.exports = router;
