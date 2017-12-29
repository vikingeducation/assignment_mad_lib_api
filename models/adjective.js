const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const wordpos = require("wordpos");

const AdjectiveSchema = new Schema({
  word: {
    type: String,
    required: true
  }
});

const Adjective = mongoose.model("Adjective", AdjectiveSchema);

module.exports = Adjective;
