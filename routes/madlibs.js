const express = require('express');
const router = express.Router();
const helpers = require('./../helpers');
const h = helpers.registered;
const WordPOS = require('wordpos');
const wordpos = new WordPOS();
const DEFAULT_COUNT = 10;
const Sentencer = require('sentencer');

router.get('/:pos', (req, res) => {
  let randomWordGen;
  let isValidRequest = true;
  if (req.params.pos === "nouns") {
    randomWordGen = wordpos.randNoun;
  } else if (req.params.pos === "verbs") {
    randomWordGen = wordpos.randVerb;
  } else if (req.params.pos === "adverbs") {
    randomWordGen = wordpos.randAdverb;
  } else if (req.params.pos === "adjectives") {
    randomWordGen = wordpos.randAdjective;
  } else {
    res.status(400).json(`Error: The resource '${req.params.pos}' could not be found`);
    isValidRequest = false;
  }

  // validations if user provided parameter
  if (req.query.count) {
    if (+req.query.count < 1) {
      res.status(400).json('Error: Count cannot be less than 1');
      isValidRequest = false;
    } else if (!Number.isInteger(+req.query.count)) {
      res.status(400).json('Error: Count must be an integer');
      isValidRequest = false;
    } else {
      count = +req.query.count;
    }
  } else {
    count = DEFAULT_COUNT;
  }

  if (isValidRequest) {
    randomWordGen.call(wordpos, { count })
      .then(result => {
        res.status(200).json(result);
      });
  }
});

const getRandDefaults = async () => {
  let randomDefaults = {};
  randomDefaults.nouns = await wordpos.randNoun();
  randomDefaults.verbs = await wordpos.randVerb();
  randomDefaults.adverbs = await wordpos.randAdverb();
  randomDefaults.adjectives = await wordpos.randAdjective();

  return randomDefaults;
};

const parseInput = (userInput, defaults) => {
  let results = {};
  for (let key in userInput) {
    if (userInput[key].length === 0) {
      results[key] = defaults[key];
    } else {
      results[key] = userInput[key];
    }
  }

  return results;
};

router.post('/madlibs', (req, res) => {

  let randomDefaults = getRandDefaults;
  let parsed = parseInput(req.body, randomDefaults);

  Sentencer.configure({
    nounList: parsed.nouns,

    actions: {
      my_action: function(){
        return "something";
      }
    }
  });
  let result = Sentencer.make(parsed.sentence);
  res.status(200).json(result);
});

module.exports = router;