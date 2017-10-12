const express = require("express");
const router = express.Router();
const Sentencer = require("sentencer");
const Wordpos = require("wordpos");
const wordpos = new Wordpos({ profile: true });
const passport = require("passport");
const verbs = require("../sentencerWords/verbs");
const adverbs = require("../sentencerWords/adverbs");

Sentencer.configure({
  // additional actions for the template engine to use.
  // you can also redefine the preset actions here if you need to.
  // See the "Add your own actions" section below.
  actions: {
    verb: function() {
      var selector = Math.floor(Math.random() * verbs.length);
      return verbs[selector];
    },
    adverb: function() {
      var selector = Math.floor(Math.random() * adverbs.length);
      return adverbs[selector];
    }
  }
});

//http://localhost:4000/api/v1/madlib?access_token=123abc
router.get(
  "/madlib",
  passport.authenticate("bearer", { session: false }),
  (req, res, next) => {
    var results = [];
    if (req.query.count) {
      var count = req.query.count;
    } else {
      var count = 10;
    }
    if (req.query.pos) {
      switch (req.query.pos) {
        case "noun":
          for (var i = 0; i < count; i++) {
            results.push(Sentencer.make("{{ noun }}"));
          }
          break;
        case "nouns":
          for (var i = 0; i < count; i++) {
            results.push(Sentencer.make("{{ nouns }}"));
          }
          break;
        case "adjective":
          for (var i = 0; i < count; i++) {
            results.push(Sentencer.make("{{ adjective }}"));
          }
          break;
        case "verb":
          for (var i = 0; i < count; i++) {
            results.push(Sentencer.make("{{ verb }}"));
          }
          break;
        case "adverb":
          for (var i = 0; i < count; i++) {
            results.push(Sentencer.make("{{ adverb }}"));
          }
          break;
        default:
          results = [
            "Try pos=noun, pos=nouns, pos=adjective, pos=verb, or pos=adverb"
          ];
      }
      res.status(200).json(results);
    } else if (req.query.story) {
      if (req.query.words && req.query.words.length) {
        wordpos.getPOS(req.query.words, function(result) {
          Sentencer.configure({
            nounList: result.nouns,

            adjectiveList: result.adjectives,

            actions: {
              verb: function() {
                if (result.verbs.length) {
                  return result.verbs[
                    Math.floor(Math.random() * result.verbs.length)
                  ];
                } else {
                  return ["missing verb"];
                }
              },
              adverb: function() {
                if (result.adverbs.length) {
                  return result.adverbs[
                    Math.floor(Math.random() * result.adverbs.length)
                  ];
                } else {
                  return [" |*missing adverb*| "];
                }
              }
            }
          });
          results = Sentencer.make(req.query.story);
          res.status(200).json(results);
        });
      } else {
        results = Sentencer.make(req.query.story);
        res.status(200).json(results);
      }
    } else {
      res.status(400).json("Error: Incorrect Formatting Input");
    }
  }
);

module.exports = router;
