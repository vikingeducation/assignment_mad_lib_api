const User = require("./models/user");

// ------------------
// addUser Middleware
//-------------------

let addUser = async (fname, lname, email, password, next) => {
  const user = new User({ fname, lname, email, password });
  await user.save();
  next();
};

module.exports = addUser;
