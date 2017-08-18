const madlibs = require('../models');
const generateMadlib = require('../utils/madlib');

module.exports = {
	create: async function(req, res) {
		//  const id = req.params.id;
		try {
			const madlib = await generateMadlib(req.body.sentence);
			return res.json({ result: madlib });
		} catch (e) {
			return res.json({ message: e.message });
		}
	}
};
