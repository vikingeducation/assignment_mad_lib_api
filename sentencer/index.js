const Sentencer = require('sentencer');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();

let verbList = [];
let adverbList = [];
module.exports = async function(sentence, words) {
	if (!sentence || (!words || !Array.isArray(words) || 1 > words.length)) {
		return res.status(500).json({ message: 'Invalid parameters passed' });
	}

	const pos = await wordpos.getPOS(words.join(' '));
	const { nouns, adjectives } = pos;
	verbList = pos.verbs;
	adverbList = pos.adverbs;

	Sentencer.configure({
		nounList: nouns,
		adjectiveList: adjectives,
		actions: {
			verb: verb,
			adverb: adverb
		}
	});

	return Sentencer.make(sentence);
};

function verb() {
	let rand = Math.floor(Math.random() * verbList.length);
	return verbList[rand];
}

function adverb() {
	let rand = Math.floor(Math.random() * adverbList.length);
	return adverbList[rand];
}
