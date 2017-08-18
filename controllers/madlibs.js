const madlibs = require("../models");
const generateMadlib = require("../utils/madlib");

module.exports = {
  create: async function(req, res) {
    //  const id = req.params.id;
    try {
      const madlib = await generateMadlib.PoopMadlibOut(req.body.sentence);
      return res.json({ result: madlib });
    } catch (e) {
      return res.json({ message: e.message });
    }
  },
  getWords: async function(req, res) {
    //  const id = req.params.id;
    try {
      const madlib = await generateMadlib.GetWords(
        req.params.type,
        req.body.number
      );
      return res.json({ result: madlib });
    } catch (e) {
      return res.json({ message: e.message });
    }
  }
};
