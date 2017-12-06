const BearerStrategy = require("passport-http-bearer").Strategy;
const { User } = require("./../models");

// Create the token bearer strategy
module.exports = new BearerStrategy((token, done) => {
	// Find the user by token
	User.findOne({ token: token })
		.then(user => {
			// Pass the user if found else false
			return done(null, user || false);
		})
		.catch(e => done(null, false));
});
