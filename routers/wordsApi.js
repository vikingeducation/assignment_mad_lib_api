const express = require('express');
const router = express.Router();
const helpers = require('./../helpers');
const h = helpers.registered;
const passport = require('passport');
const nouns = require('./nouns.js');
const verbs = require('./verbs.js');
const adverbs = require('./adverbs.js');
const adjectives = require('./adjectives.js');


// ----------------------------------------
// Index
// ----------------------------------------


router.get(
  '/',

  // Register the passport bearer strategy middleware
  // we this router's only route
  /*passport.authenticate('bearer', { session: false })
  ,*/
  (req, res, next) => {
    "GOT INTO authenticate"

    // Callback for the route
    // serves the data from the API
    next();
  });
router.post(
  '/',

  // Register the passport bearer strategy middleware
  // we this router's only route
  passport.authenticate('bearer', { session: false }), (req, res, next) => {

    // Callback for the route
    // serves the data from the API
    next();
  })


router.use('/nouns.js', nouns);
router.use('/verbs.js', verbs);
router.use('/adverbs.js', adverbs);
router.use('/adjectives.js', adjectives);



module.exports = router;