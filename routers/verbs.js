var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var models = require("./../models");
var Verb = mongoose.model("Verb");



router.get("/:count", async function(req, res) {
  let verbs = await Verb.find({}, { _id: 0, __v: 0 }).limit(req.params.count);
  verbs = verbs.map(word => word.word);

  res.json(verbs);
});

router.get("/", async function(req, res) {
  let verbs = await Verb.find({}, { _id: 0, __v: 0 }).limit(10);
  verbs = verbs.map(word => word.word);

  res.json(verbs);

});


module.exports = router;