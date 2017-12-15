let mongoose = require("mongoose");
let bluebird = require("bluebird");

mongoose.Promise = bluebird;

let models = {};

models.Noun = require("./noun");
models.Verb = require("./verb");
models.Adverb = require("./adverb");
models.Adjective = require("./adjective");

module.exports = models;
