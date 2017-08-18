const express = require("express");
const router = express.Router();
const h = require("./../helpers");
// const passport = require("passport");
const WordPos = require("wordpos");
const wordpos = new WordPos();
const Sentencer = require("sentencer");

module.exports = middlewares => {
  router.get("/nouns", middlewares, async (req, res) => {
    const count = req.query.count || 10;
    const data = await wordpos.randNoun({ count: count });
    res.json(data);
  });

  router.get("/verbs", middlewares, async (req, res) => {
    const count = req.query.count || 10;
    const data = await wordpos.randVerb({ count: count });
    res.json(data);
  });

  router.get("/adjectives", middlewares, async (req, res) => {
    const count = req.query.count || 10;
    const data = await wordpos.randAdjective({ count: count });
    res.json(data);
  });

  router.get("/adverbs", middlewares, async (req, res) => {
    const count = req.query.count || 10;
    const data = await wordpos.randAdverb({ count: count });
    res.json(data);
  });

  router.post("/stories", middlewares, async (req, res) => {
    let sentence = req.body.sentence;
    let words = req.body.words;
    words = await wordpos.getPOS(words);
    await Sentencer.configure({
      nounList: words.nouns,
      adjectiveList: words.adjectives,
      actions: {
        verb: () => {
          let index = Math.floor(Math.random() * words.verbs.length);
          let verb = words.verbs[index];
          words.verbs.splice(index, 1);
          return verb;
        },
        adverb: () => {
          let index = Math.floor(Math.random() * words.adverbs.length);
          let adverb = words.adverbs[index];
          words.adverbs.splice(index, 1);
          return adverb;
        }
      }
    });

    sentence = await Sentencer.make(sentence);
    res.json({ sentence: sentence });
  });
  return router;
};
