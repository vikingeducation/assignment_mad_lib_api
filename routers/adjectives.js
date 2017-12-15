var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var models = require("./../models");
var Adjective = mongoose.model("Adjective");



router.get("/:count", async function(req, res) {
  let adjectives = await Adjective.find({}, { _id: 0, __v: 0 }).limit(req.params.count);
  adjectives = adjectives.map(word => word.word);
  res.json(adjectives);
});

router.get("/", async function(req, res) {
  let adjectives = await Adjective.find({}, { _id: 0, __v: 0 }).limit(10);
  adjectives = adjectives.map(word => word.word);
  res.json(adjectives);

});


module.exports = router;