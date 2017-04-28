const express = require("express");
const router = express.Router();
const request = require("request");

router.get("/makeStory", (req, res) => {
  res.render("frontEnd");
});

router.post("/makeStory", (req, res) => {
  request.post;
});

module.exports = router;
