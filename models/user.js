const mongoose = require("mongoose");
const unique = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const md5 = require("md5");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  token: String
});

UserSchema.plugin(unique);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});

UserSchema.pre("save", next => {
  this.token = md5(`${this.email}${uuid()}`);
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
