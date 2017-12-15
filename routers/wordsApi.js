const express = require('express');
const router = express.Router();
const helpers = require('./../helpers');
const h = helpers.registered;
const furiousSpinoff = require('furious_spinoff');
const passport = require('passport');
const nouns = require('./nouns.js');
const verbs = require('./verbs.js');
const adverbs = require('./adverbs.js');
const adjectives = require('./adjectives.js');


// ----------------------------------------
// Index
// ----------------------------------------

router.use('/nouns.js', nouns);
router.use('/verbs.js', verbs);
router.use('/adverbs.js', adverbs);
router.use('/adjectives.js', adjectives);

router.get(
  '/furious_spinoffs',

  // Register the passport bearer strategy middleware
  // we this router's only route
  passport.authenticate('bearer', { session: false }),

  // Callback for the route
  // serves the data from the API
  (req, res, next) => {
    const count = +req.query.count || 10;
    const titles = [];
    for (let i = 0; i < count; i++) {
      titles.push(furiousSpinoff());
    }
    res.status(200).json(titles);
  }
);

module.exports = router;