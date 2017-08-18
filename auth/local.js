// const LocalStrategy = require('passport-local').Strategy;
// const { User } = require('../models');

// function getLocalStrategy() {
//     const localStrategy = new LocalStrategy(
//         {
//             // Set username field to email
//             // to match form
//             usernameField: 'username',
//             passwordField: 'password'
//         },
//         (username, password, done) => {
//             // Find user by username

//             User.findOne({ username: username })
//                 .then(user => {
//                     console.log('used passport login');
//                     // The user is valid if the password is valid
//                     const isValid = bcrypt.compareSync(password, user.password);

//                     // If the user is valid pass the user
//                     // to the done callback
//                     // Else pass false
//                     return done(null, isValid ? user : false);
//                 })
//                 .catch(e => done(null, false));
//         }
//     );

//     return localStrategy;
// }

// module.exports = getLocalStrategy;
