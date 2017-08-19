const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const md5 = require("md5");
const uuid = require("uuid");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    token: { type: String, unique: true }
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);

// Instance Methods
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// Virtual Properties
UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});


UserSchema.pre('save', function(next) {
  this.token = md5(`${ this.email }${ uuid() }`);
  next();
});


const User = mongoose.model("User", UserSchema);

module.exports = User;
