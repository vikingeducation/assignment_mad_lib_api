const mongoose = require('mongoose');
const mongooseValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt');
const uuid = require('shortid');

const UserSchema = new mongoose.Schema({
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
	apiToken: {
		type: String,
		required: true,
		unique: true
	}
}, {
	timestamps = true
})

UserSchema.plugin(mongooseValidator);

UserSchema.virtual('password')
	.get(function() {
		return this.passwordHash;
	})
	.set(function(pass) {
		this._password = pass;
		this.passwordHash = bcrypt.hashSync(pass, 8);
	})

UserSchema.path('hashedPassword').validate(function(pass) {
	if (this._password.length < 8) {
		this.invalidate('password', 'Password must be at least 8 characters');
	}
});

serSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};


UserSchema.pre('save', function(next) {
  this.token = md5(`${ this.email }${ uuid() }`);
  next();
});


const User = mongoose.model('User', UserSchema);
console.log(User);

module.exports = User;
