const MadLibList = require("../src/MadLibList");
const MadLib = require("../src/MadLib");
const Wordpos = require("wordpos");
let wordpos = new Wordpos();

describe("MadLibList", () => {
  beforeEach(() => {
    this.madLib = new MadLibList();
    this.trueArray = [];
  });

  it("returns a specified number of words", async () => {
    let string = "nouns";
    let number = 5;
    let result = await this.madLib.list(string, 5);
    let resultArr = result.map(async x => {
      let y = await wordpos.isNoun(x);
      return y;
    });
    for (let i = 0; i < 5; i++) {
      this.trueArray.push(true);
    }
    expect(await Promise.all(resultArr)).toEqual(this.trueArray);
    expect(result.length).toEqual(5);
    expect(typeof result).toEqual("object");
  });

  describe("MadLibNouns", () => {
    beforeEach(() => {
      for (let i = 0; i < 10; i++) {
        this.trueArray.push(true);
      }
    });

    it("returns a list of nouns", async () => {
      let string = "nouns";
      let result = await this.madLib.list(string);
      let resultArr = result.map(async x => {
        let y = await wordpos.isNoun(x);
        return y;
      });
      expect(await Promise.all(resultArr)).toEqual(this.trueArray);
      expect(result.length).toEqual(10);
      expect(typeof result).toEqual("object");
    });

    it("returns a list of verbs", async () => {
      let string = "verbs";
      let result = await this.madLib.list(string);
      let resultArr = result.map(async x => {
        let y = await wordpos.isVerb(x);
        return y;
      });
      expect(await Promise.all(resultArr)).toEqual(this.trueArray);
      expect(result.length).toEqual(10);
      expect(typeof result).toEqual("object");
    });

    it("returns a list of adverbs", async () => {
      let string = "adverbs";
      let result = await this.madLib.list(string);
      let resultArr = result.map(async x => {
        let y = await wordpos.isAdverb(x);
        return y;
      });
      expect(await Promise.all(resultArr)).toEqual(this.trueArray);
      expect(result.length).toEqual(10);
      expect(typeof result).toEqual("object");
    });

    it("returns a list of adjectives", async () => {
      let string = "adjectives";
      let result = await this.madLib.list(string);
      let resultArr = result.map(async x => {
        let y = await wordpos.isAdjective(x);
        return y;
      });
      expect(await Promise.all(resultArr)).toEqual(this.trueArray);
      expect(result.length).toEqual(10);
      expect(typeof result).toEqual("object");
    });
  });
});

describe("MadLibList", () => {
  it("create a MadLib from a story and list of words", async () => {
    let madLib = new MadLib();
    let madLibList = new MadLibList();
    let nounList = await madLibList.list("nouns");
    // let verbList = await madLibList.list("verbs");
    // let adverbList = await madLibList.list("adverbs");
    let adjectiveList = await madLibList.list("adjectives");
    let story =
      "Once upon {{ a_noun }}, there was {{an_adjective}} {{noun}} who lived in {{an_adjective}} {{noun}}. Then {{noun}} died. The {{noun}}.";
    let ourStory = await madLib.story(story, nounList, adjectiveList);
    console.log(ourStory);
    expect(typeof ourStory).toEqual("string");
  });
});
