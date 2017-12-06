const express = require("express");
const router = express.Router();

var Sentencer = require("sentencer");

var WordPos = require("wordpos");
var wordpos = new WordPos();

router.get("/", (req, res) => {
	res.render("madlibs/index");
});

router.post("/make", async (req, res) => {
	var nouns = await wordpos.randNoun({ count: 50 });
	var adjectives = await wordpos.randAdjective({ count: 50 });
	var verbs = await wordpos.randVerb({ count: 50 });
	var adverbs = await wordpos.randAdverb({ count: 50 });
	Sentencer.configure({
		nounList: nouns,
		adjectiveList: adjectives,
		actions: {
			verb: function() {
				var arrIndex = Math.floor(Math.random() * 50);
				return verbs[arrIndex];
			},
			adverb: function() {
				var arrIndex = Math.floor(Math.random() * 50);
				return adverbs[arrIndex];
			}
		}
	});
	var madlib = Sentencer.make(req.body.madlib);
	res.json(madlib);
});

module.exports = router;
