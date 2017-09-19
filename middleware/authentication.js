module.exports = {
	isLoggedIn: (req, res, next) => {
		if (req.user) {
			next();
		} else {
			res.redirect("/login");
		}
	},

	isLoggedOut: (req, res, next) => {
		if (!req.user) {
			next();
		} else {
			res.redirect(`/users/${req.user.id}`);
		}
	}

	// isCurrentUser: (req, res, next) => {
	// 	if (req.user.id === req.params.id) {
	// 		next();
	// 	} else {
	// 		res.render("unauthorized");
	// 	}
	// }
};
