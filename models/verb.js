const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const wordpos = require("wordpos");

const VerbSchema = new Schema({
  word: {
    type: String,
    required: true
  }
});

const Verb = mongoose.model("Verb", VerbSchema);

module.exports = Verb;
