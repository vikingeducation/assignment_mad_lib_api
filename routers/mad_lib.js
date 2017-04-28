const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
const Sentencer = require("sentencer");
const faker = require("faker");

// ----------------------------------------
// Index
// ----------------------------------------
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
