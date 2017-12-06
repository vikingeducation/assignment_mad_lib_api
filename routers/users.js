const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");
const h = require("./../helpers");

const passport = require("passport");

// Set up middleware to allow/disallow login/logout
const loggedInOnly = (req, res, next) => {
	return req.user ? next() : res.redirect("/login");
};

const loggedOutOnly = (req, res, next) => {
	return !req.user ? next() : res.redirect("/");
};

// Show login only if logged out
router.get("/login", loggedOutOnly, (req, res) => {
	res.render("sessions/new");
});

// Allow logout via GET and DELETE
const onLogout = (req, res) => {
	req.logout();
	req.method = "GET";
	res.redirect("/login");
};

router.get("/logout", loggedInOnly, onLogout);
router.delete("/logout", loggedInOnly, onLogout);

// Create session with passport
router.post(
	"/sessions",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true
	})
);

// Show
const onShow = (req, res) => {
	res.render("users/show", { currentUser: req.user });
};

router.get("/", loggedInOnly, onShow);
router.get("/user", loggedInOnly, onShow);

// New
router.get("/user/new", loggedOutOnly, (req, res) => {
	res.render("users/new");
});

// Create
router.post("/users", loggedOutOnly, (req, res, next) => {
	let userParams = {
		fname: req.body.user.fname,
		lname: req.body.user.lname,
		email: req.body.user.email,
		password: req.body.user.password
	};

	User.create(userParams)
		.then(user => {
			req.flash("success", "User created! You may now login.");
			res.redirect("/");
		})
		.catch(e => {
			if (e.errors) {
				Object.keys(e.errors).forEach(key => {
					req.flash("error", `${e.errors[key].message}`);
					res.redirect("back");
				});
			} else {
				next(e);
			}
		});
});

module.exports = router;
