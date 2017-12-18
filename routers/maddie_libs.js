const express = require("express");
const router = express.Router();

const passport = require("passport");

var WordPos = require("wordpos");
var wordpos = new WordPos();

// format of call
// http://localhost:3000/api/v1/nouns?access_token=(token goes here)&count=x
// x is any number, 5 is default

// get some nouns
router.get(
	"/nouns",
	passport.authenticate("bearer", { session: false }),
	(req, res) => {
		const count = +req.query.count || 5;
		wordpos.randNoun({ count }, nouns => {
			res.status(200).json(nouns);
		});
	}
);

// get some verbs
router.get(
	"/verbs",
	passport.authenticate("bearer", { session: false }),
	(req, res) => {
		const count = +req.query.count || 5;
		wordpos.randVerb({ count }, verbs => {
			res.status(200).json(verbs);
		});
	}
);

// get some adverbs
router.get(
	"/adverbs",
	passport.authenticate("bearer", { session: false }),
	(req, res) => {
		const count = +req.query.count || 5;
		wordpos.randAdverb({ count }, adverbs => {
			res.status(200).json(adverbs);
		});
	}
);

// get some adjectives
router.get(
	"/adjectives",
	passport.authenticate("bearer", { session: false }),
	(req, res) => {
		const count = +req.query.count || 5;
		wordpos.randAdjective({ count }, adjectives => {
			res.status(200).json(adjectives);
		});
	}
);

module.exports = router;