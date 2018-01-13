const express = require('express');
const passport = require('passport');
const WordPOS = require('wordpos');
const Sentencer = require('sentencer');
const h = require('./../helpers');

const router = express.Router();
const wordpos = new WordPOS();

const _createStory = (text, words) => {
  return wordpos.getPOS(words).then(POS => {
    Sentencer.configure({
      nounList: POS.nouns,
      adjectiveList: POS.adjectives,
      actions: {
        verb: function() {
          return POS.verbs[Math.floor(Math.random() * POS.verbs.length)];
        },
        adverb: function() {
          return POS.adverbs[Math.floor(Math.random() * POS.adverbs.length)];
        }
      }
    });

    return Sentencer.make(text);
  });
};

router.get(
  '/:pos',
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    const count = +req.query.count || 10;
    const wordposMethod = h.wordposMethod(req.params.pos);

    if (!wordposMethod) {
      res
        .status(400)
        .json('BAD REQUEST. Did you specify a valid part of speech?');
    }

    wordposMethod
      .call(wordpos, { count })
      .then(results => {
        res.status(200).json(results);
      })
      .catch(next);
  }
);

router.post(
  '/madlibs',
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    const text = req.body.text;
    const words = req.body.words.join(' ');

    _createStory(text, words)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(next);
  }
);

module.exports = router;
