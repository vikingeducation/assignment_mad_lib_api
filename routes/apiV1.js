const router = require("express").Router();
const WordPOS = require("wordpos");
const wp = new WordPOS();

router.get("/", (req, res) => res.json({ name: "Mad Lib API" }));

const typeMap = {
  nouns: wp.randNoun,
  verbs: wp.randVerb,
  adverbs: wp.randAdverb,
  adjectives: wp.randAdjective
};

router.get("/:type", (req, res, next) => {
  const count = req.query.count || 10;
  const typeFunc = typeMap[req.params.type];
  if (typeFunc) {
    typeFunc({ count }).then(words => res.json(words)).catch(e => next(e));
  } else {
    next();
  }
});

// router.get("/nouns", (req, res, next) => {
//   const count = req.query.count || 10;
//   wp.randNoun({ count }).then(words => res.json(words)).catch(e => next(e));
// });

// router.get("/verbs", (req, res, next) => {
//   const count = req.query.count || 10;
//   wp.randVerb({ count }).then(words => res.json(words)).catch(e => next(e));
// });

// router.get("/adverbs", (req, res, next) => {
//   const count = req.query.count || 10;
//   wp.randAdverb({ count }).then(words => res.json(words)).catch(e => next(e));
// });

// router.get("/adjectives", (req, res, next) => {
//   const count = req.query.count || 10;
//   wp
//     .randAdjective({ count })
//     .then(words => res.json(words))
//     .catch(e => next(e));
// });

router.get("*", (req, res) => {
  res.json({ error: "404 Not Found" });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.stack });
});

module.exports = router;
