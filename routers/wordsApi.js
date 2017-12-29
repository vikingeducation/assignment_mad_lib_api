const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
const passport = require("passport");
const Noun = require("../models/noun");
const Verb = require("../models/verb");
const Adverb = require("../models/adverb");
const Adjective = require("../models/adjective");
var Sentencer = require("sentencer");
var WordPOS = require("wordpos");
var wordpos = new WordPOS();

module.exports = middlewares => {
  // Extract middlewares
  const { loggedInOnly, loggedOutOnly } = middlewares;

  // ----------------------------------------
  // Index
  // ----------------------------------------

  router.get(
    "/madlib",
    passport.authenticate("bearer", { session: false }),
    async (req, res, next) => {
      let story = req.params.sentence;

      wordpos.getAdjectives(story, async function(result) {
        result.forEach(async adjective => {
          story = story.replace(adjective, await wordpos.randAdjective());
        });
        console.log("story------------");
        console.log(story);
      });

      res.json(story);
    }
  );

  router.get(
    "/:resource",
    passport.authenticate("bearer", { session: false }),
    async (req, res, next) => {
      let resource = req.params.resource;
      let model = {
        nouns: Noun,
        verbs: Verb,
        adverbs: Adverb,
        adjectives: Adjective
      }[resource];

      let result = await model.find({}, { _id: 0, __v: 0 }).limit(10);

      result = result.map(word => word.word);

      res.json(result);
    }
  );

  router.post(
    "/",

    // Register the passport bearer strategy middleware
    // we this router's only route
    loggedInOnly,
    (req, res, next) => {
      // Callback for the route
      // serves the data from the API
      next();
    }
  );

  return router;
};
