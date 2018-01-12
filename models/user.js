const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const uuid = require('uuid/v4');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fname: {
      type: String,
      required: true
    },
    lname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    token: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);

UserSchema.virtual('password')
  .get(function() {
    return this.passwordHash;
  })
  .set(function(value) {
    this._password = value;
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

UserSchema.path('passwordHash').validate(function(val) {
  if (this._password.length < 8) {
    this.invalidate('password', 'Password must be at least 8 characters');
  }
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.pre('save', function(next) {
  this.token = md5(`${this.email}${uuid()}`);
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
