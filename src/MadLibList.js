const Wordpos = require("wordpos");
let wordpos = new Wordpos();
class MadLibList {
  constructor() {}
  async list(string, number = 10) {
    let results = [];
    let command;
    switch (string) {
      case "nouns":
        command = "randNoun";
        break;
      case "verbs":
        command = "randVerb";
        break;
      case "adverbs":
        command = "randAdverb";
        break;
      case "adjectives":
        command = "randAdjective";
        break;
      default:
        command = "rand";
    }
    for (let i = 0; i < number; i++) {
      let result = await wordpos[command]();
      results.push(result[0]);
    }
    // console.log(results);
    return results;
  }
}
module.exports = MadLibList;
