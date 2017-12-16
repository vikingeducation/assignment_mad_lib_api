const Wordpos = require("wordpos");
const Sentencer = require("sentencer");
let wordpos = new Wordpos();
class MadLib {
  constructor() {}
  async story(string, nounArray, adjArray) {
    Sentencer.configure({
      nounList: nounArray,
      adjectiveList: adjArray,
      actions: {
        my_action: () => {
          return "something";
        }
      }
    });
    let ourStory = await Sentencer.make(string);
    return ourStory.toString();
  }
}
module.exports = MadLib;
