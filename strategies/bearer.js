const BearerStrategy = require("passport-http-bearer").Strategy;
const { User } = require("../models");

const bearerStrategy = new BearerStrategy((token, done) => {
  User.findOne({ token: token })
    .then(user => {
      return done(null, user || false);
    })
    .catch(e => done(null, false));
});

module.exports - bearerStrategy;
