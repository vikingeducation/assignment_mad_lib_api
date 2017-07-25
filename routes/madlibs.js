const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
const WordPOS = require("wordpos");
const wordpos = new WordPOS();
const DEFAULT_COUNT = 10;
const Sentencer = require("sentencer");
const services = require('./../services/madlibs');

router.get("/:pos", (req, res) => {
  let isValidRequest = true;
  let randomWordGen = services.getWordRequestType(req.params.pos);
  if (!randomWordGen) {
    res
      .status(400)
      .json(`Error: The resource '${req.params.pos}' could not be found`);
    isValidRequest = false;
  }

  // validations if user provided parameter
  if (req.query.count) {
    if (+req.query.count < 1) {
      res.status(400).json("Error: Count cannot be less than 1");
      isValidRequest = false;
    } else if (!Number.isInteger(+req.query.count)) {
      res.status(400).json("Error: Count must be an integer");
      isValidRequest = false;
    } else {
      count = +req.query.count;
    }
  } else {
    count = DEFAULT_COUNT;
  }

  if (isValidRequest) {
    randomWordGen.call(wordpos, { count }).then(result => {
      res.status(200).json(result);
    });
  }
});


router.post("/madlibs", (req, res, next) => {
  if (!req.body.sentence) {
    res.status(400).json("Error: You must provide a sentence.");
  } else {
    next();
  }
}, (req, res) => {
  let randomDefaults = services.getRandDefaults();
  let parsed = services.parseInput(req.body, randomDefaults);

  Sentencer.configure({
    nounList: parsed.nouns,
    adjectiveList: parsed.adjectives,

    actions: {
      verb: function() {
        let rand = Math.floor(Math.random() * parsed.verbs.length);
        return parsed.verbs[rand];
      },
      adverb: function() {
        let rand = Math.floor(Math.random() * parsed.adverbs.length);
        return parsed.adverbs[rand];
      }
    }
  });

  let result = Sentencer.make(parsed.sentence);
  res.status(200).json(result);
});

module.exports = router;
