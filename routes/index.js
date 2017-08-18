const router = require('express').Router();
const { createSignedSessionId, loggedInOnly, loggedOutOnly, onLogout } = require('../session/Session.js');
const { User } = require('../models');
const passport = require('../auth/passport');

router.get('/', loggedInOnly, (req, res) => {
	res.render('landing/index', { user: req.user });
});

router.get('/login', loggedOutOnly, (req, res) => {
	res.render('login/index');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})
);

router.get('/logout', onLogout);

module.exports = router;
