const express = require('express');
const router = express.Router();
const passport = require('passport');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();
const Sentencer = require('sentencer');

function sanitizeCount(req, _, next) {
	req.query.count = +req.query.count || 10;
	if (req.query.count < 0) req.query.count = 10;
	next();
}

router.get('/', sanitizeCount, (_, res) => {
	res.status(200).end('api');
});

router.get('/nouns', sanitizeCount, async (req, res) =>
	res.json(await wordpos.randNoun({ count: req.query.count }))
);

router.get('/verbs', sanitizeCount, async (req, res) =>
	res.json(await wordpos.randVerb({ count: req.query.count }))
);

router.get('/adverbs', sanitizeCount, async (req, res) =>
	res.json(await wordpos.randAdverb({ count: req.query.count }))
);

router.get('/adjectives', sanitizeCount, async (req, res) =>
	res.json(await wordpos.randAdjective({ count: req.query.count }))
);

router.post('/stories', async (req, res) => {
	let { sentence, words } = req.body;

	if (!sentence || (!words || !Array.isArray(words) || 1 > words.length)) {
		return res.status(500).json({ message: 'Invalid parameters passed' });
	}

	try {
		let pos = await wordpos.getPOS(words.join(' '));

		Sentencer.configure({
			nounList: pos.nouns,
			adjectiveList: pos.adjectives
			//verbList: pos.verbs,
			//adverbList:
		});

		sentence =
			'This sentence has {{ a_noun }} and {{ an_adjective }} {{ noun }} in it.';

		const sentence = Sentencer.make(sentence);

		res.json({ sentence, words });
	} catch (err) {
		res.status(500).json({ message: err.message, stack: err.stack });
	}
});

module.exports = router;
