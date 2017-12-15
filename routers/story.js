const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
var WordPOS = require("wordpos"),
  wordpos = new WordPOS();
var Sentencer = require("sentencer");
const passport = require("passport");

let randomVerbs = [
  "unite",
  "help",
  "whip",
  "introduce",
  "protect",
  "cross",
  "subtract",
  "scream",
  "rain",
  "pedal",
  "object",
  "charge",
  "practise",
  "load",
  "hope",
  "claim",
  "attend",
  "destroy",
  "trace",
  "pass",
  "type",
  "bruise",
  "remember",
  "snow",
  "wobble",
  "whistle",
  "seal",
  "step",
  "joke",
  "phone",
  "nail",
  "replace",
  "guide",
  "melt",
  "record",
  "smoke",
  "print",
  "admit",
  "add",
  "screw"
];

Sentencer.configure({
  actions: {
    adjectives: function() {
      return Sentencer.make("{{ adjective }}");
    },
    verbs: function() {
      return randomVerbs[Math.floor(Math.random(randomVerbs.length - 1))];
    }
  }
});

// ----------------------------------------
// Story
// ----------------------------------------
router.post("/story", async (req, res, next) => {
  passport.authenticate("bearer", { session: false });

  let story = req.body.sentence;
  let words = await wordpos.getPOS(story, console.log);
  let templated = async function(words) {
    let temp = story;
    for (let key in words) {
      if (key !== "rest") {
        words[key].forEach(element => {
          temp = temp.replace(element, `{{ ${key} }}`);
        });
      }
    }
    return temp;
  };
  let result = await templated(words);
  let finalResult = await Sentencer.make(result);
  console.log("=======================");
  console.log(finalResult);
  console.log("=======================");
  res.status(200).json(finalResult);
});

router.get(
  "/story",

  // Register the passport bearer strategy middleware
  // we this router's only route
  passport.authenticate("bearer", { session: false }),

  // Callback for the route
  // serves the data from the API
  (req, res, next) => {
    res.status(200).json(randomVerbs);
  }
);

module.exports = router;
