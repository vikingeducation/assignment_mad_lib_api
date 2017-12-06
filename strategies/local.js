const LocalStrategy = require("passport-local").Strategy;
const { User } = require("./../models");

// Create local strategy
module.exports = new LocalStrategy(
	{
		// Set username field to email
		// to match form
		usernameField: "email"
	},
	(email, password, done) => {
		// Find user by email
		User.findOne({ email: email })
			.then(user => {
				// The user is valid if the password is valid
				const isValid = user.validatePassword(password);

				// If the user is valid pass the user
				// to the done callback
				// Else pass false
				return done(null, isValid ? user : false);
			})
			.catch(e => done(null, false));
	}
);
