const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
const furiousSpinoff = require("furious_spinoff");

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/furious_spinoffs", (req, res, next) => {
  const count = +req.query.count || 10;
  const titles = [];
  for (let i = 0; i < count; i++) {
    titles.push(furiousSpinoff());
  }
  res.status(200).json(titles);
});

module.exports = router;

