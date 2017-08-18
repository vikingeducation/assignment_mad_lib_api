const Sentencer = require("sentencer");
const WordPOS = require("wordpos");
const wordpos = new WordPOS();

// ['barge', 'barf', 'barter_away'] 'bar'

module.exports = PoopMadlibOut;

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
async function PoopMadlibOut(story) {
  let verbArr = await wordpos.randVerb({ count: 20 });
  let nounArr = await wordpos.randVerb({ count: 20 });
  let adjArr = await wordpos.randAdjective({ count: 20 });
  Sentencer.configure({
    nounList: nounArr,
    adjectiveList: adjArr,
    verbList: verbArr
  });
  return Sentencer.make(story);
}

async function ParseSentence(sentence) {
  // let sentenceArray = sentence.split(" ");
  // sentenceArray.forEach(i =>{
  // 	let noun
  // 	if(wordpos.isNoun(i, callback))
  // });
}

// /generateWords();
