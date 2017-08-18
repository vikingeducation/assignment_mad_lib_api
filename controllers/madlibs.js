const madlibs = require("../models");
const generateMadlib = require("../utils/madlib");
module.exports = {
  index: async function(req, res) {
    try {
      const madlibs = await Madlib.findAll();
      return res.json({ result: madlibs });
    } catch (e) {
      return res.json({ message: e.message });
    }
  },
  view: async function(req, res) {
    const id = req.params.id;
    try {
      const madlib = await Madlib.findById(id);
      return res.json({ result: madlib });
    } catch (e) {
      return res.json({ message: e.message });
    }
  },
  create: async function(req, res) {
    //  const id = req.params.id;
    try {
      const madlib = await generateMadlib(req.body.sentence);
      return res.json({ result: madlib });
    } catch (e) {
      return res.json({ message: e.message });
    }
  }
};
