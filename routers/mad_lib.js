const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
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

router.get("/mad_lib", (req, res, next) => {
  const count = +req.query.count || 10;
  const noun = req.query.noun || false;
  const adjective = req.query.adjective || false;
  let result = {};
  let nouns = [];
  let adjectives = [];
  if (noun) {
    for (let i = 0; i < count; i++) {
      nouns.push(Sentencer.make("{{ noun }}"));
    }
    result.nouns = nouns;
  }
  if (adjective) {
    for (let i = 0; i < count; i++) {
      adjectives.push(Sentencer.make("{{ adjective }}"));
    }
    result.adjectives = adjectives;
  }
  res.status(200).json(result);
});

module.exports = router;
