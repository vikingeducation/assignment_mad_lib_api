const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");

module.exports = middlewares => {
  const { loggedInOnly, loggedOutOnly } = middlewares;

  // ----------------------------------------
  // Show
  // ----------------------------------------
  const onShow = (req, res) => {
    var user = req.user;
    res.render("user/view", { user });
  };

  // Showing a user only if logged in
  router.get("/", loggedInOnly, onShow);
  router.get("/user", loggedInOnly, onShow);

  //–––––––––––––
  // New
  //–––––––––––––
  router.get("/register", loggedOutOnly, (req, res) => {
    res.render("login/register");
  });

  //–––––––––––––
  // Create
  //–––––––––––––
  router.post("/register", loggedOutOnly, (req, res) => {
    const userParams = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password
    };
    User.create(userParams)
      .then(user => {
        req.login(user, function() {
          res.redirect("/login");
        });
      })
      .catch(e => {
        console.log(e);
        res.redirect("/");
      });
  });

  return router;
};
