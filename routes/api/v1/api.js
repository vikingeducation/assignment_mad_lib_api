const express = require('express');
const router = express.Router();
const passport = require('passport');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();
const Sentencer = require('sentencer');

router.get('/', (_, res) => {
	res.status(200).send('api');
});

const requireToken = passport.authenticate('bearer', {
	session: false
});

router.get('/nouns', requireToken, async (req, res) => {
	let count = +req.query.count || 10;
	if (count < 0) count = 10;

	return res.json(await wordpos.randNoun({ count }));
});

router.get('/verbs', requireToken, async (req, res) => {});

router.get('/adjectives', requireToken, async (req, res) => {});

router.get('/adverbs', requireToken, async (req, res) => {});

module.exports = router;
