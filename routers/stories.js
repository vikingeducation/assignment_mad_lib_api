const express = require("express");
const router = express.Router();
const request = require("request");

let story = [
"Mary had a little {{noun}}, little {{noun}}, little {{noun}}, Mary had a little {{noun}}, it`s fleece was {{adjective}} as snow.",
"Jack and Jill {{verb}} up the hill to {{verb}} a {{adverb}} of water, Jack fell {{adjective}}, {{verb}} his {{noun}} and Jill came tumbling {{adverb}}",
"Baa baa {{adjective}} sheep, {{verb}} you any {{noun}}? Yes sir, yes sir, three {{noun}} {{adjective}}.",
"Twinkle, twinkle, {{adjective}} star, how I {{verb}} what you are, up above the {{noun}} so {{adverb}}, like a {{adjective}} {{noun}} in the sky.",
"Humpty Dumpty {{verb}} on a {{noun}}, Humpty Dumpty had a {{adjective}} fall. All the {{noun}} men could not put Humpty together again."
];

let predefined_words = ["huge", "thief", "quickly", "dog", "baby", "cry", "ran", "fast", "red"];
let words = [];

router.get("/", (req, res) => {
  res.render("showStory");
});

router.post("/", (req, res) => {
	if (req.body.words) 
		words = req.body.words.split(" ");
	else
		words = predefined_words;

  request.post(
    {
      url: `http://localhost:3000/api/v1/maddie_libs?access_token=${req.user.token}`,
      form: {
        words: words,
        story: story[req.body.story]
      }
    },
    (err, response, body) => {
      let story = JSON.parse(body);
      story = story.charAt(0).toUpperCase() + story.slice(1);
      if (story[story.length - 1] != ".") {
        story += ".";
      }
      res.render("showStory", { story });
    }
  );
});

router.get("/nouns", (req, res) => {
  request.get(
    `http://localhost:3000/api/v1/nouns?access_token=${req.user.token}`,
    (err, response, body) => {
      let nouns = JSON.parse(body);
      res.render("showStory", { nouns });
    }
  );
});

router.get("/verbs", (req, res) => {
  request.get(
    `http://localhost:3000/api/v1/verbs?access_token=${req.user.token}`,
    (err, response, body) => {
      let verbs = JSON.parse(body);
      res.render("showStory", { verbs });
    }
  );
});

router.get("/adjectives", (req, res) => {
  request.get(
    `http://localhost:3000/api/v1/adjectives?access_token=${req.user.token}`,
    (err, response, body) => {
      let adjectives = JSON.parse(body);
      res.render("showStory", { adjectives });
    }
  );
});

router.get("/adverbs", (req, res) => {
  request.get(
    `http://localhost:3000/api/v1/adverbs?access_token=${req.user.token}`,
    (err, response, body) => {
      let adverbs = JSON.parse(body);
      res.render("showStory", { adverbs });
    }
  );
});

module.exports = router;
