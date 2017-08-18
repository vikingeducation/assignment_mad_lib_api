const router = require("express").Router();
const WordPOS = require("wordpos");
const wp = new WordPOS();

router.get("/", (req, res) => res.json({ name: "Mad Lib API" }));

const typeMap = {
  nouns: "randNoun",
  verbs: "randVerb",
  adverbs: "randAdverb",
  adjectives: "randAdjective"
};

router.get("/:type", (req, res, next) => {
  const count = req.query.count || 10;
  const typeFunc = typeMap[req.params.type];
  if (typeFunc) {
    wp[typeFunc]({ count }).then(words => res.json(words)).catch(e => next(e));
  } else {
    next();
  }
});

router.post("/sentences", (req, res) => {
  const {words, template} = req.body;
  if (!words || !template) {
    res.status(400).json({ error: "words list and template sentence are both required" });
  } else {
    res.end("sentence here")
  }
  
})


router.get("*", (req, res) => {
  res.json({ error: "404 Not Found" });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.stack });
});

module.exports = router;
