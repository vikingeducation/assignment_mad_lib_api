const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const wordpos = require("wordpos");

const NounSchema = new Schema({
  word: {
    type: String,
    required: true
  }
});

const Noun = mongoose.model("Noun", NounSchema);

module.exports = Noun;
