const express = require('express');
const passport = require('passport');
const WordPOS = require('wordpos');
const Sentencer = require('sentencer');
const h = require('./../helpers');

const router = express.Router();
const wordpos = new WordPOS();

router.get(
  '/:pos',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    const count = +req.query.count || 10;
    const wordposMethod = h.wordposMethod(req.params.pos);

    if (!wordposMethod) {
      res
        .status(400)
        .json('BAD REQUEST. Did you specify a valid part of speech?');
    }

    wordposMethod.call(wordpos, { count }).then(results => {
      res.status(200).json(results);
    });
  }
);

router.post(
  '/madlibs',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    const { text, words } = req.body;

    wordpos.getPOS(words, POS => {
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
      const results = Sentencer.make(text);
      res.status(200).json(results);
    });
  }
);

module.exports = router;
