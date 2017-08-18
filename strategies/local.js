const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models");

const localOpts = { usernameField: "email" };
const localHandler = (email, password, done) => {
  User.findOne({ email })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        done(null, false, { message: "Invalid username/password" });
      } else done(null, user);
    })
    .catch(e => done(e));
};

module.exports = new LocalStrategy(localOpts, localHandler);
