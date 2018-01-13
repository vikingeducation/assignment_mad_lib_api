const WordPOS = require('wordpos');

const wordpos = new WordPOS();
const MadLibHelper = {};

MadLibHelper.wordposMethod = pos => {
  if (pos === 'nouns') {
    return wordpos.randNoun;
  } else if (pos === 'verbs') {
    return wordpos.randVerb;
  } else if (pos === 'adverbs') {
    return wordpos.randAdverb;
  } else if (pos === 'adjectives') {
    return wordpos.randAdjective;
  } else {
    return false;
  }
};

module.exports = MadLibHelper;
