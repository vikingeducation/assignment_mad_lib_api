const MadLib = require("../src/MadLib");
const Wordpos = require("wordpos");
let wordpos = new Wordpos();

describe("MadLib", () => {
  beforeEach(() => {
    this.madLib = new MadLib();
  });

  it("returns a list of nouns", async () => {
    let string = "nouns";
    let result = await this.madLib.list(string);
    // console.log(result);
    let resultArr = result.map(async x => {
      let y = await wordpos.isNoun(x);
      console.log(y);
      return y;
    });
    // console.log(resultArr);
    let trueArray = [];
    for (let i = 0; i < 10; i++) {
      trueArray.push(true);
    }
    expect(await Promise.all(resultArr)).toEqual(trueArray);
    expect(result.length).toEqual(10);
    expect(typeof result).toEqual("object");
  });
});
