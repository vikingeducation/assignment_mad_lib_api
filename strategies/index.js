const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const { User } = require('../models');

module.exports = {
	local: new LocalStrategy({ usernameField: 'email' }, async function(
		email,
		password,
		done
	) {
		try {
			const user = await User.findOne({ email: email });
			if (!user || !user.validatePassword(password)) {
				throw new Error('Error: Invalid email/password combination.');
			}
			return done(null, user);
		} catch (err) {
			done(err);
		}
	}),
	bearer: new BearerStrategy(async function(token, done) {
		try {
			const user = await User.findOne({ apiToken: token });
			if (!user) {
				throw new Error('Error: Invalid API token supplied.');
			}
			return done(null, user);
		} catch (err) {
			done(err);
		}
	}),
	serializeUser: (user, done) => { done(null, user.id) },

	deserializeUser: async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch(err) {
			done(err, false);
		}
	}

};
