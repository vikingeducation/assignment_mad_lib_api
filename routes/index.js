const express = require("express");
const router = express.Router();
const h = require("../helpers");
const { User } = require("../models");
const faker = require('faker');

// Authentication Middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect(h.loginPath());
};

// Route Handlers
function authenticate(passport) {
  //main page
  router.get("/", ensureAuthenticated, (req, res) => {
    res.render("index");
  });

  //login view
  router.get("/login", (req, res) => {
    User.find().then(r => {
      if (!r.length) res.redirect(h.registerPath());
      else res.render("login");
    });
  });

  //login handler
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: h.loginPath(),
      failureFlash: true
    })
  );

  //register view
  router.get("/register", (req, res) => {
    const fake = {
      fname: faker.name.firstName(),
      lname: faker.name.lastName(),
      email: faker.internet.email()      
    }
    res.render("register", {fake});
  });

  //register handler
  router.post("/register", (req, res, next) => {
    const { fname, lname, email, password } = req.body;
    User.create({ fname, lname, email, password })
      .then(user => {
        req.login(user, err => {
          if (err) next(err);
          else res.redirect("/");
        });
      })
      .catch(e => res.status(500).end(e.stack));
  });

  //logout handler
  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  return router;
}

module.exports = authenticate;
