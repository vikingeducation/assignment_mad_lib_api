var express = require('express');
var router = express.Router();

const loggedInOnly = (req, res, next) => {
	return req.user ? next() : res.redirect('/login');
};

const loggedOutOnly = (req, res, next) => {
	return !req.user ? next() : res.redirect('/');
};

// Show login only if logged out
router.get('/login', loggedOutOnly, (req, res) => {
	req.flash('info', 'Welcome to MAD LIB, please login!');
	res.render('login');
});

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

router.get('/', loggedInOnly, (req, res) => {
	res.render('index');
});

module.exports = router;
