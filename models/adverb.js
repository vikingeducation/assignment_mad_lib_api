const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const wordpos = require("wordpos");

const AdverbSchema = new Schema({
  word: {
    type: String,
    required: true
  }
});

const Adverb = mongoose.model("Adverb", AdverbSchema);

module.exports = Adverb;
