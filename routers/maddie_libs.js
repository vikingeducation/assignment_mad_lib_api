const express = require("express");
const router = express.Router();

const passport = require("passport");

var WordPos = require("wordpos");
var wordpos = new WordPos();
const Sentencer = require("sentencer");
const _ = require("lodash");

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

router.post(
	"/maddie_libs", 
	passport.authenticate("bearer", { session: false }),
	(req, res) => {
	  let words = req.body.words;
	  let story = req.body.story;

	  wordpos.getPOS(words, result => {

	    Sentencer.configure({
	      nounList: result.nouns,
	      adjectiveList: result.adjectives,

	      actions: {
	        verb: function() {
	          return _.shuffle(result.verbs)[0];
	        },
	        adverb: function() {
	          return _.shuffle(result.adverbs)[0];
	        }
	      }
    	});
    let madLib = Sentencer.make(story);
    res.status(200).json(madLib);
  });
});

module.exports = router;