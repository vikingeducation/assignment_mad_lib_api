const WordPOS = require("wordpos");
const wordpos = new WordPOS();

const services = {};

services.getWordRequestType = (wordRequest) => {
  if (wordRequest === "nouns") {
    return wordpos.randNoun;
  } else if (wordRequest === "verbs") {
    return wordpos.randVerb;
  } else if (wordRequest === "adverbs") {
    return wordpos.randAdverb;
  } else if (wordRequest === "adjectives") {
    return wordpos.randAdjective;
  } else {
    return false;
  }
};

services.getRandDefaults = async () => {
  let randomDefaults = {};
  randomDefaults.nouns = await wordpos.randNoun();
  randomDefaults.verbs = await wordpos.randVerb();
  randomDefaults.adverbs = await wordpos.randAdverb();
  randomDefaults.adjectives = await wordpos.randAdjective();

  return randomDefaults;
};

// provides random words where user did not provide an option
services.parseInput = (userInput, defaults) => {
  let results = {};
  for (let key in userInput) {
    if (userInput[key].length === 0) {
      results[key] = defaults[key];
    } else {
      results[key] = userInput[key];
    }
  }

  return results;
};

module.exports = services;