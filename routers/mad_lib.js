const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
const _ = require("lodash");
const Sentencer = require("sentencer");
var WordPOS = require("wordpos"), wordpos = new WordPOS();
// ----------------------------------------
// Index
// ----------------------------------------
router.get("/nouns", (req, res) => {
  const count = +req.query.count || 10;
  let nouns;
  wordpos.randNoun({ count }, result => {
    nouns = result;
    res.status(200).json(nouns);
  });
});

router.get("/verbs", (req, res) => {
  const count = +req.query.count || 10;
  let verbs;
  wordpos.randVerb({ count }, result => {
    verbs = result;
    res.status(200).json(verbs);
  });
});

router.get("/adjectives", (req, res) => {
  const count = +req.query.count || 10;
  let adjectives;
  wordpos.randAdjective({ count }, result => {
    adjectives = result;
    res.status(200).json(adjectives);
  });
});

router.get("/adverbs", (req, res) => {
  const count = +req.query.count || 10;
  let adverbs;
  wordpos.randAdverb({ count }, result => {
    adverbs = result;
    res.status(200).json(adverbs);
  });
});

router.post("/mad_lib", (req, res) => {
  let words = req.body.words;
  let story = req.body.story;

  wordpos.getPOS(words, result => {
    console.log(result);
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
