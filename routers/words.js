const express = require('express');
const router = express.Router();
const passport = require('passport');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();

router.get(
  '/:wordType',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    const acceptedTypes = ['nouns', 'verbs', 'adverbs', 'adjectives'];
    if (acceptedTypes.indexOf(req.params.wordType) === -1) {
      res.status(400).json({ status: 400, message: "Bad Request" });
      return;
    }

    const count = req.query.count || 10;
    const method = getMethod(req.params.wordType);
    wordpos[method]({ count })
      .then(result => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(400).json({ status: 400, message: "Bad Request" });
      });
  });

const getMethod = wordType => {
  wordType = wordType.charAt(0).toUpperCase() + wordType.slice(1, wordType.length - 1);
  return `rand${ wordType }`;
};

module.exports = router;
