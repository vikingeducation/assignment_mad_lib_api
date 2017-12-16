// routers/users.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const models = require('./../models');
const User = mongoose.model('User');
const helpers = require('./../helpers');
const h = helpers.registered;


module.exports = (middlewares) => {

  // Extract middlewares
  const {
    loggedInOnly,
    loggedOutOnly
  } = middlewares;

  // ----------------------------------------
  // Show
  // ----------------------------------------
  const onShow = (req, res) => {
    res.render('users/show', { currentUser: req.user });
  };

  // Showing a user only if logged in
  router.get('/', loggedInOnly, onShow);
  router.get('/user', loggedInOnly, onShow);


  // ----------------------------------------
  // New
  // ----------------------------------------

  // Allow user registration only if logged out
  router.get('/user/new', loggedOutOnly, (req, res) => {
    res.render('users/new');
  });


  // ----------------------------------------
  // Create
  // ----------------------------------------

  // Allow user creation only if logged out
  router.post('/users', loggedOutOnly, (req, res, next) => {
    let userParams = {
      fname: req.body.user.fname,
      lname: req.body.user.lname,
      email: req.body.user.email,
      password: req.body.user.password
    };

    User.create(userParams)
      .then((user) => {
        req.flash('success', 'User created! You may now login.');
        res.redirect('/login');
      })
      .catch((e) => {
        if (e.errors) {
          Object.keys(e.errors).forEach((key) => {
            req.flash('error', `${ e.errors[key].message }`);
            res.redirect(req.session.backUrl);
          });
        } else {
          next(e);
        }
      });
  });


  return router;
};
