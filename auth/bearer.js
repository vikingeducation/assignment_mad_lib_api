// const BearerStrategy = require('passport-http-bearer').Strategy;
// const { User } = require('../models');

// function getBearerStrategy() {
// 	const bearerStrategy = new BearerStrategy((token, done) => {
// 		// Find the user by token
// 		console.log('used bearer authenticate');
// 		User.findOne({ token: token })
// 			.then(user => {
// 				// Pass the user if found else false
// 				return done(null, user || false);
// 			})
// 			.catch(e => done(null, false));
// 	});
// 	return bearerStrategy;
// }

// module.exports = getBearerStrategy;
