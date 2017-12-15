const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
var WordPOS = require("wordpos"),
  wordpos = new WordPOS();
// ----------------------------------------
// Story
// ----------------------------------------
router.post("/", async (req, res, next) => {
  let story = req.body.sentence;
  let words = await wordpos.getPOS(story, console.log);
  let templated = story.replace();
  res.status(200).json(result);
});

module.exports = router;
