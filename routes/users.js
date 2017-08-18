const express = require("express");
const router = express.Router();
const { User } = require("./../models");
const auth = require("./../middleware/authentication");

router.post("/", (req, res) => {
	User.create({
		email: req.body.email,
		password: req.body.password
	}).then(user => {
		res.redirect(`/users/${user.id}`);
	});
});

router.get("/me", auth.isLoggedIn, (req, res) => {
	res.render("./users/index", { user: req.user });
});

module.exports = router;
