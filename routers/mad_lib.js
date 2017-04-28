const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
const sentencer = require("sentencer");
const faker = require("faker");

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/mad_lib", (req, res, next) => {
  const count = +req.query.count || 10;
  const titles = [];
  for (let i = 0; i < count; i++) {
    titles.push(faker.hacker.noun());
  }
  res.status(200).json(titles);
});

module.exports = router;
