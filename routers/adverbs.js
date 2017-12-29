var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var models = require("./../models");
var Adverb = mongoose.model("Adverb");



router.get("/:count", async function(req, res) {
  let adverbs = await Adverb.find({}, { _id: 0, __v: 0 }).limit(req.params.count);
  adverbs = adverbs.map(word => word.word);
  res.json(adverbs);
});

router.get("/", async function(req, res) {
  let adverbs = await Adverb.find({}, { _id: 0, __v: 0 }).limit(10);
  adverbs = adverbs.map(word => word.word);
  res.json(adverbs);

});


module.exports = router;