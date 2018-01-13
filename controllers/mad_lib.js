const express = require('express');
// const mongoose = require('mongoose');
// const models = require('./../models');
const passport = require('passport');
const WordPOS = require('wordpos');
const Sentencer = require('sentencer');
const h = require('./../helpers');

const router = express.Router();
const wordpos = new WordPOS();

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

    wordposMethod.call(wordpos, { count }).then(results => {
      res.status(200).json(results);
    });
  }
);

// router.get(
//   '/verbs',
//   passport.authenticate('bearer', { session: false }),
//   (req, res, next) => {
//     // Stuff
//   }
// );
//
// router.get(
//   '/adverbs',
//   passport.authenticate('bearer', { session: false }),
//   (req, res, next) => {
//     // Stuff
//   }
// );
//
// router.get(
//   '/adjectives',
//   passport.authenticate('bearer', { session: false }),
//   (req, res, next) => {
//     // Stuff
//   }
// );
//
// router.get(
//   '/mad_lib',
//   passport.authenticate('bearer', { session: false }),
//   (req, res, next) => {
//     // Stuff
//   }
// );

module.exports = router;
