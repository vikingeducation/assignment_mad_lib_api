const Wordpos = require("wordpos");
let wordpos = new Wordpos();
class MadLib {
  constructor() {}
  async list(string, number = 10) {
    let results = [];
    for (let i = 0; i < number; i++) {
      let result = await wordpos.randNoun();
      results.push(result[0]);
    }
    // console.log(results);
    return results;
  }
}
module.exports = MadLib;
