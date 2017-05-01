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
      story = story.charAt(0).toUpperCase() + story.slice(1);
      if (story[story.length - 1] != ".") {
        story += ".";
      }
      res.render("frontEnd", { story });
    }
  );
});

router.get("/nouns", (req, res) => {
  request.get(
    "http://localhost:3000/api/v1/nouns?token=a3c6805d57a0bd10b3e7e12caa249025",
    (err, response, body) => {
      let nouns = JSON.parse(body);
      res.render("frontEnd", { nouns });
    }
  );
});

router.get("/verbs", (req, res) => {
  request.get(
    "http://localhost:3000/api/v1/verbs?token=a3c6805d57a0bd10b3e7e12caa249025",
    (err, response, body) => {
      let verbs = JSON.parse(body);
      res.render("frontEnd", { verbs });
    }
  );
});

router.get("/adjectives", (req, res) => {
  request.get(
    "http://localhost:3000/api/v1/adjectives?token=a3c6805d57a0bd10b3e7e12caa249025",
    (err, response, body) => {
      let adjectives = JSON.parse(body);
      res.render("frontEnd", { adjectives });
    }
  );
});

router.get("/adverbs", (req, res) => {
  request.get(
    "http://localhost:3000/api/v1/adverbs?token=a3c6805d57a0bd10b3e7e12caa249025",
    (err, response, body) => {
      let adverbs = JSON.parse(body);
      res.render("frontEnd", { adverbs });
    }
  );
});

module.exports = router;
