const express = require("express");
const router = express.Router();
const h = require("./../helpers");
const furiousSpinoff = require("furious_spinoff");
const passport = require("passport");

router.get(
  "/maddest_libs",
  passport.authenticate("bearer", { session: false }),
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
