const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../models');

const loggedInOnly = (req, res, next) => {
	return req.user ? next() : res.redirect('/login');
};

const loggedOutOnly = (req, res, next) => {
	return !req.user ? next() : res.redirect('/');
};

router.get('/signup', loggedOutOnly, (req, res) => {
	res.render('signup');
});

router.post('/signup', loggedOutOnly, async (req, res, next) => {
	try {
		const user = await User.create(req.body.user);
		if (!user) {
			throw new Error('Error, unable to create user...');
		}

		await req.login(user, () => {});
		if (!req.isAuthenticated())
			throw new Error(`Error, unable to login with ${user.username}...`);

		res.redirect('/');
	} catch (err) {
		next(err);
	}
});

// Show login only if logged out
router.get('/login', loggedOutOnly, (req, res) => {
	req.flash('info', 'Welcome to MAD LIB, please login!');
	res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})
);

// Allow logout via GET and DELETE
const onLogout = (req, res) => {
	// Passport convenience method to logout
	req.logout();

	// Ensure always redirecting as GET
	req.method = 'GET';
	res.redirect('/login');
};

router.get('/logout', loggedInOnly, onLogout);
router.delete('/logout', loggedInOnly, onLogout);

router.get('/', loggedInOnly, async (req, res) => {
	res.render('index', { user: req.user });
});

module.exports = router;
