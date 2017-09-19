const express = require("express");
const router = express.Router();
const Sentencer = require("sentencer");
const WordPOS = require("wordpos");
const wordpos = new WordPOS();
// const { User } = require("./../models");
// const auth = require("./../middleware/authentication");

router.get("/nouns", (req, res) => {
  console.log("in nouns");
  const count = Number(req.query.count) || 10;
  wordpos.randNoun({ count: count }, wordList => {
    res.json(wordList);
  });
});
module.exports = router;
