const mongoose = require('mongoose');

// Set test environment
process.env.NODE_ENV = 'test';

beforeAll(done => {
	if (mongoose.connection.readyState) {
		done();
	} else {
		const beginConnection = mongoose.connect(process.env.DB_URL, {
			useMongoClient: true
		});

		beginConnection
			.then(db => {
				console.log('DB CONNECTION SUCCESS');
			})
			.catch(err => {
				console.error(err);
			});
	}
});

// afterEach(done => {
// 	require('./../../seeds/clean')().then(() => done()).catch(e => console.error(e.stack));
// });
