const Sentencer = require("sentencer");
const WordPOS = require("wordpos");
const wordpos = new WordPOS();

// ['barge', 'barf', 'barter_away'] 'bar'
var NOUN_ARR = [];
var VERB_ARR = [];
var ADJECTIVE_ARR = [];
var ADVERB_ARR = [];
module.exports = { PoopMadlibOut, GetWords };

async function generateWords() {
  let random = {};

  let verbArr = await wordpos.randVerb({ count: 20 });
  let nounArr = await wordpos.randVerb({ count: 20 });
  let adjArr = await wordpos.randAdjective({ count: 20 });
  // verbList = verbArr;
  // nounList = nounArr;
  // adjectiveList = adjArr;
  Sentencer.configure({
    nounList: nounArr,
    adjectiveList: adjArr,
    verbList: verbArr
  });
  // console.log(
  //   Sentencer.make("hello my name is {{ noun }} and I am {{ adjective }}")
  // );
}
async function PoopMadlibOut(story, words) {
  let verbArr = await wordpos.randVerb({ count: 20 });
  let nounArr = await wordpos.randNoun({ count: 20 });
  let adjArr = await wordpos.randAdjective({ count: 20 });

  if (words) {
    console.log("this is in the if");
    await parseWords(words);
    console.log(NOUN_ARR, VERB_ARR, ADJECTIVE_ARR, ADVERB_ARR);
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

  for (i = 0; i < wordArr.length - 1; i++) {
    let nounBool = await wordpos.isNoun(wordArr[i]);
    console.log(nounBool, "noun");
    if (nounBool === true) {
      NOUN_ARR.push(wordArr[i]);
    }
    let verbBool = await wordpos.isVerb(wordArr[i]);
    console.log(verbBool, "verb");
    if (verbBool === true) {
      VERB_ARR.push(wordArr[i]);
    }
    let adjectiveBool = await wordpos.isAdjective(wordArr[i]);
    console.log(adjectiveBool, "adj");
    if (adjectiveBool === true) {
      ADJECTIVE_ARR.push(wordArr[i]);
    }
    let adverbBool = await wordpos.isAdjective(wordArr[i]);
    console.log(adverbBool, "adverb");
    if (adverbBool === true) {
      ADVERB_ARR.push(wordArr[i]);
    }
  }

  return true;
}

// /generateWords();
