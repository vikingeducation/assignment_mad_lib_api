const express = require("express");
const router = express.Router();

const passport = require("passport");

var WordPos = require("wordpos");
var wordpos = new WordPos();

// get some nouns
// http://localhost:3000/api/v1/nouns?access_token=(token goes here)&count=100
router.get(
	"/nouns",
	passport.authenticate("bearer", { session: false }),
	(req, res) => {
		const count = +req.query.count || 10;
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
		const count = +req.query.count || 10;
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
		const count = +req.query.count || 10;
		wordpos.randAdverb({ count }, adverbs => {
			res.status(200).json(adverbs);
		});
	}
);

// get some adjective
router.get(
	"/adjective",
	passport.authenticate("bearer", { session: false }),
	(req, res) => {
		const count = +req.query.count || 10;
		wordpos.randAdjective({ count }, adjective => {
			res.status(200).json(adjective);
		});
	}
);

module.exports = router;
