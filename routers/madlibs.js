const express = require('express');
const router = express.Router();
const passport = require('passport');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();
const Sentencer = require('sentencer');

router.post(
  '/',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    const data = {};
    data.status = "200";
    data.input_text = req.query.text;
    data.input_words = req.query.words;

    if (!data.input_words) {
      res.status(400).send({ status: 400, message: 'Bad Request - No words given' });
      return;
    }

    wordpos.getPOS(data.input_words)
      .then(result => {
        data.POS = result;

        if (!data.input_text) throw 'No Text';

        const nounList = result.nouns;
        const adjectiveList = result.adjectives;
        const verb = () => getOne(result.verbs);
        const adverb = () => getOne(result.adverbs);

        Sentencer.configure({ nounList, adjectiveList, actions: { verb, adverb } });
        data.output = Sentencer.make(data.input_text);

        res.status(200).json(data);
      })
      .catch(e => {
        if (e === 'No Text') {
          res.status(400).send({ status: 400, message: 'Bad Request - No text given' });
        } else {
          res.status(400).send({ status: 400, message: 'Bad Request - cannot generate madlib with words given' });
        }
      });
  }
);

const getOne = (posTypeCollection) => {
  return posTypeCollection[Math.floor(Math.random() * posTypeCollection.length)];
};


module.exports = router;
