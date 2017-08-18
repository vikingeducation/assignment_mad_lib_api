const express = require("express");
const router = express.Router();
const h = require("./../helpers");
const passport = require("passport");
const WordPos = require("wordpos");
const wordpos = new WordPos();

router.get("/nouns", async (req, res) => {
  const count = req.query.count || 10;
  const data = await wordpos.randNoun({ count: count });
  res.json(data);
});

router.get("/verbs", async (req, res) => {
  const count = req.query.count || 10;
  const data = await wordpos.randVerb({ count: count });
  res.json(data);
});

router.get("/adjectives", async (req, res) => {
  const count = req.query.count || 10;
  const data = await wordpos.randAdjective({ count: count });
  res.json(data);
});

router.get("/adverbs", async (req, res) => {
  const count = req.query.count || 10;
  const data = await wordpos.randAdverb({ count: count });
  res.json(data);
});

router.post("/stories", (req, res) => {
  const sentence = req.body.sentence;
  const words = req.body.words;
  console.log(sentence);
  console.log(words);
  res.send("I have an obese bruise, and it tends to lurk faddishly");
});

//
// router.get(
//   "/",
//   passport.authenticate("bearer", { session: false }),
//   (req, res, next) => {
//     const count = +req.query.count || 10;
//     const titles = [];
//     for (let i = 0; i < count; i++) {
//       titles.push(furiousSpinoff());
//     }
//     res.status(200).json(titles);
//   }
// );

module.exports = router;
