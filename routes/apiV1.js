const router = require("express").Router();
const WordPOS = require("wordpos");
const wp = new WordPOS();

router.get("/", (req, res) => res.json({ name: "Mad Lib API" }));

router.get("/nouns", (req, res, next) => {
  const count = req.query.count || 10;
  wp.randNoun({ count }).then(words => res.json(words)).catch(e => next(e));
});

router.get("/verbs", (req, res, next) => {
  const count = req.query.count || 10;
  wp.randVerb({ count }).then(words => res.json(words)).catch(e => next(e));
});

router.get("*", (req, res) => {
  res.json({ error: "404 Not Found" });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.stack });
});

module.exports = router;
