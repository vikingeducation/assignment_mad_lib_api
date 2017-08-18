const Sentencer = require('sentencer');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();

// ['barge', 'barf', 'barter_away'] 'bar'
let NOUN_ARR = [];
let VERB_ARR = [];
let ADJECTIVE_ARR = [];

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

  Sentencer.configure({
    nounList: nounArr,
    adjectiveList: adjArr,
    verbList: verbArr
  });

  if (words) {
    let speechTypes = parseWords(words);
    console.log(speechTypes, 'what is this?');
  }

  // if (!NOUN_ARR.length || !VERB_ARR || !ADJECTIVE_ARR) {
  //   NOUN_ARR = await wordpos.randVerb({ count: 20 });
  //   VERB_ARR = await wordpos.randNoun({ count: 20 });
  //   ADJECTIVE_ARR = await wordpos.randAdjective({ count: 20 });
  // }

  return Sentencer.make(story);
}
async function GetWords(type, amount) {
  let newArray = [];
  switch (type.toLowerCase()) {
    case 'noun':
      newArray = await wordpos.randNoun({ count: amount });
      break;
    case 'verb':
      newArray = await wordpos.randVerb({ count: amount });
      break;
    case 'adjective':
      newArray = await wordpos.randAdjective({ count: amount });
      break;
  }
  console.log(newArray);
  return newArray;
}

function parseWords(words) {
  const typeObj = {
    nouns: [],
    verbs: [],
    adjectives: [],
    adverbs: []
  };

  const wordArr = words.split(' ');
  console.log(wordArr, 'this is word');

  wordArr.forEach(async word => {
    let checkNoun = await wordpos.isNoun(word);

    // if (wordpos.isNoun(word)) {
    //   console.log('noun found?');
    //   typeObj.nouns.push(word);
    // }

    // if (wordpos.isVerb(word)) {
    //   typeObj.verbs.push(word);
    // }

    // if (wordpos.isAdjective(word)) {
    //   typeObj.adjectives.push(word);
    // }

    // if (wordpos.isAdverb(word)) {
    //   typeObj.adverbs.push(word);
    // }
  });

  return typeObj;
}

// /generateWords();
