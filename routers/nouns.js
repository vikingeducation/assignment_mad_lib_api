var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var models = require("./../models");
var Noun = mongoose.model("Noun");



router.get("/:count", async function(req, res) {
  let nouns = await Noun.find({}, { _id: 0, __v: 0 }).limit(req.params.count);
  nouns = nouns.map(word => word.word);
  res.json(nouns);
});

router.get("/", async function(req, res) {
  let nouns = await Noun.find({}, { _id: 0, __v: 0 }).limit(10);
  nouns = nouns.map(word => word.word);
  res.json(nouns);

});


module.exports = router;