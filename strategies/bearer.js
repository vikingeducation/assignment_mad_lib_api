const BearerStrategy = require("passport-http-bearer").Strategy;
const { User } = require("../models");

const localHandler = (token, done)=>{
  User.findOne({token}).then(user=>{
    done(null, user || false)
  })
  .catch(err => {
    done(null, false)
  })
}


module.exports = new BearerStrategy(localHandler);