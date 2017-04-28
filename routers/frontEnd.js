const express = require("express");
const router = express.Router();
const request = require("request");

router.get("/", (req, res) => {
  res.render("frontEnd");
});

router.post("/", (req, res) => {
  request.post(
    {
      url: `http://localhost:3000/api/v1/mad_lib?token=a3c6805d57a0bd10b3e7e12caa249025`,
      form: {
        words: req.body.words.split(" "),
        story: req.body.story
      }
    },
    (err, response, body) => {
      let story = JSON.parse(body);
      res.render("frontEnd", { story });
    }
  );
});

module.exports = router;
