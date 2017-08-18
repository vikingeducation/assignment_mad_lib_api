const mongoose = require('mongoose');
const connect = require('../../mongo');

// Set test environment
process.env.NODE_ENV = 'test';

beforeAll(async done => {
	if (mongoose.connection.readyState) {
		done();
	} else {
		await connect();
	}
});
