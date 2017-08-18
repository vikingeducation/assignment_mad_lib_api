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
    const words = req.body.words;
    const wordsObj = await wordpos.getPOS(words);
    await Sentencer.configure({
      nounList: wordsObj.nouns,
      adjectiveList: wordsObj.adjectives,
      action: {
        verb: () => {
          let index = Math.floor(Math.random() * wordsObj.verbs.length);
          let verb = wordsObj.verbs[index];
          wordObj.splice(index, 1);
          return verb;
        },
        adverb: () => {
          let index = Math.floor(Math.random() * wordsObj.verbs.length);
          let adverb = wordsObj.adverbs[index];
          wordObj.splice(index, 1);
          return adverb;
        }
      }
    });

    sentence = await Sentencer.make(sentence);
    res.json({ sentence: sentence });
  });
  return router;
};
