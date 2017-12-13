const express = require('express');
const router = express.Router();
const passport = require('passport');
const { loggedOutOnly } = require('../services/session');

router.get('/', (req, res) => res.redirect('/login'));

router.get("/login", loggedOutOnly, (req, res) => {
  res.render("sessions/new");
});

router.post('/login', loggedOutOnly,
  passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login",
    failureFlash: true
  })
);

const onLogout = (req, res) => {
  req.logout();
  res.redirect("/");
};
router.get('/logout', onLogout);
router.delete('/logout', onLogout);


module.exports = router;
