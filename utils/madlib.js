const Sentencer = require("sentencer");
const WordPOS = require("wordpos");
const wordpos = new WordPOS();

var NOUN_ARR = [];
var VERB_ARR = [];
var ADJECTIVE_ARR = [];
var ADVERB_ARR = [];

module.exports = { PoopMadlibOut, GetWords, scrubArrays };

var scrubArrays = function() {
  NOUN_ARR = [];
  VERB_ARR = [];
  ADJECTIVE_ARR = [];
  ADVERB_ARR = [];
};
async function generateWords() {
  let random = {};

  let verbArr = await wordpos.randVerb({ count: 20 });
  let nounArr = await wordpos.randVerb({ count: 20 });
  let adjArr = await wordpos.randAdjective({ count: 20 });

  Sentencer.configure({
    nounList: nounArr,
    adjectiveList: adjArr,
    verbList: verbArr
  });
}
async function PoopMadlibOut(story, words) {
  let verbArr = await wordpos.randVerb({ count: 20 });
  let nounArr = await wordpos.randNoun({ count: 20 });
  let adjArr = await wordpos.randAdjective({ count: 20 });

  if (words) {
    await parseWords(words);
  } else {
    if (NOUN_ARR.length < 1) {
      NOUN_ARR = nounArr;
    }
    if (VERB_ARR.length < 1) {
      VERB_ARR = verbArr;
    }
    if (ADJECTIVE_ARR.length < 1) {
      ADJECTIVE_ARR = adjArr;
    }
  }
  Sentencer.configure({
    nounList: NOUN_ARR,
    adjectiveList: ADJECTIVE_ARR,
    verbList: VERB_ARR
  });

  return Sentencer.make(story);
}
async function GetWords(type, amount) {
  let newArray = [];
  switch (type.toLowerCase()) {
    case "noun":
      NOUN_ARR = await wordpos.randNoun({ count: amount });
      newArray = NOUN_ARR;
      break;
    case "verb":
      VERB_ARR = await wordpos.randVerb({ count: amount });
      newArray = VERB_ARR;
      break;
    case "adjective":
      ADJECTIVE_ARR = await wordpos.randAdjective({ count: amount });
      newArray = ADJECTIVE_ARR;
      break;
  }
  console.log(newArray);
  return newArray;
}

async function parseWords(words) {
  let wordArr = words.split(" ");

  for (i = 0; i < wordArr.length; i++) {
    let nounBool = await wordpos.isNoun(wordArr[i]);
    if (nounBool === true) NOUN_ARR.push(wordArr[i]);

    let verbBool = await wordpos.isVerb(wordArr[i]);
    if (verbBool === true) VERB_ARR.push(wordArr[i]);

    let adjectiveBool = await wordpos.isAdjective(wordArr[i]);
    if (adjectiveBool === true) ADJECTIVE_ARR.push(wordArr[i]);

    let adverbBool = await wordpos.isAdjective(wordArr[i]);
    if (adverbBool === true) ADVERB_ARR.push(wordArr[i]);
  }

  return true;
}
