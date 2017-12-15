const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const md5 = require("md5");
const uuid = require("uuid/v4");

// -----------------------------
// User Model
// -----------------------------
const UserSchema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    token: String
  },
  {
    timestamps: true
  }
);

// -----------------------------
// displayName virtual
// -----------------------------

UserSchema.virtual("displayName").get(function() {
  return this.fname + " " + this.lname;
});

// -----------------------------
// token pre hook
// -----------------------------

UserSchema.pre("save", function(next) {
  this.token = md5(`${this.email}${uuid()}`);
  next();
});

// -----------------------------
// Passport, password validation
// -----------------------------

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = password => {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password")
  .get(function() {
    return this._password;
  })
  .set(function(value) {
    this._password = value;
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

const User = mongoose.model("User", UserSchema);

module.exports = User;
