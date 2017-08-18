const Sentencer = require('sentencer');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();

// ['barge', 'barf', 'barter_away'] 'bar'

Sentencer.configure({
	nounList: [],
	adjectiveList: [],
	verbList: []
});

module.exports = {
	createMadlib: () => {
		Sentencer.make('hello my name is {{ noun }} and ');
	}
};

async function generateWords() {
	let random = {};

	let verbArr = await wordpos.randVerb({ count: 3 });
}
