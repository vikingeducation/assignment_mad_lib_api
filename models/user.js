const mongoose = require("mongoose");
const uuid = require("uuid");
const uniqueValidator = require("mongoose-unique-validator");
const md5 = require("md5");
const bcrpyt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: {}
});
UserSchema.plugin(uniqueValidator);
UserSchema.pre("save", function(next) {
  this.token = md5(`${this.username}${uuid()}`);
  next();
});
module.exports = mongoose.model("User", UserSchema);
