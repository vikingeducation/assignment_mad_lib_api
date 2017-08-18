const router = require("express").Router();
const WordPOS = require("wordpos");
const wp = new WordPOS();
var Sentencer = require('sentencer');

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

const checkSentenceInputs = (req, res, next) => {
  const { words, template } = req.body;
  if (!words || !template) {
    res
      .status(400)
      .json({ error: "words list and template sentence are both required" });
  } else if (!Array.isArray(words) || typeof template !== "string") {
    res
      .status(400)
      .json({ error: "words must be an array and template must be a string" });
  } else next();
};

router.post("/sentences", checkSentenceInputs, async (req, res, next) => {
  try {
    const {nouns, verbs, adjectives, adverbs} = await wp.getPOS(req.body.words)

    const getRandomArrayMember = (array)=> {
      return array[Math.floor(Math.random()*array.length)];
    }

    const verb = ()=> {
      return getRandomArrayMember(verbs);
    }

    const adverb = ()=> {
      return getRandomArrayMember(adverbs);
    }

    
    console.log("Nouns is: ", nouns);
    console.log("Verbs is: ", verbs);
    console.log("Adjectives is: ", adjectives);
    console.log("Adverbs is: ", adverbs);

    Sentencer.configure({
      nounList: nouns,
      adjectiveList: adjectives,
      actions: {
        verb: verb,
        adverb: adverb
      }
    })
    const sentence = Sentencer.make(req.body.template);
    console.log("Sentence is: ", sentence);
    res.json({sentence})
  }
  catch (err) {
    next(err);
  }
});

router.get("*", (req, res) => {
  res.json({ error: "404 Not Found" });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.stack });
});

module.exports = router;
