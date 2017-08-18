const mongoose = require('mongoose');
const mongooseValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const uuid = require('shortid');

const UserSchema = new mongoose.Schema(
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
			type: String
		},
		apiToken: {
			type: String,
			unique: true
		}
	},
	{
		timestamps: true
	}
);

UserSchema.plugin(mongooseValidator);

UserSchema.virtual('password')
	.get(function() {
		return this.passwordHash;
	})
	.set(function(pass) {
		this._password = pass;
		this.passwordHash = bcrypt.hashSync(pass, 8);
	});

UserSchema.path('passwordHash').validate(function(pass) {
	if (this._password.length < 3) {
		this.invalidate('password', 'Password must be at least 8 characters');
	}
});

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.pre('save', function(next) {
	let fields = Object.keys(UserSchema.obj);
	fields.splice(fields.indexOf('passwordHash'), 1);
	fields.push('password');
	for (prop in this) {
		if (!this.hasOwnProperty(prop)) continue;
		if (!fields.includes(prop)) {
			delete this[prop];
		}
	}
	this.apiToken = md5(`${this.email}${uuid()}`);
	next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
