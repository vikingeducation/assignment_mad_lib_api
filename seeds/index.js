const mongoose = require("mongoose");
const mongooseeder = require("mongooseeder");
const models = require("../models");
const { Noun, Verb, Adjective, Adverb } = require("../models");

//for new names, etc.
var WordPOS = require("wordpos");
var wordpos = new WordPOS();

// var WordPOS = require('wordpos'),
//     wordpos = new WordPOS();

//for database
var env = process.env.NODE_ENV || "development";

// Always use the MongoDB URL to allow
// easy connection in all environments
const mongodbUrl =
  process.env.NODE_ENV === "production" ?
  process.env[config.use_env_variable] :
  `mongodb://localhost/mad_lib`;

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  models: models,
  clean: true,
  mongoose: mongoose,
  seeds: async() => {
    let verbs = await wordpos.randVerb({ count: 100 });
    verbs = verbs.map(verb => {
      verb = new Verb({
        word: verb
      });
      return verb;
    });

    let nouns = await wordpos.randNoun({ count: 100 });
    nouns = nouns.map(noun => {
      noun = new Noun({
        word: noun
      });
      return noun;
    });

    let adjectives = await wordpos.randAdjective({ count: 100 });
    adjectives = adjectives.map(adjective => {
      adjective = new Adjective({
        word: adjective
      });
      return adjective;
    });

    let adverbs = await wordpos.randAdverb({ count: 100 });
    adverbs = adverbs.map(adverb => {
      adverb = new Adverb({
        word: adverb
      });
      return adverb;
    });

    const promises = [];
    const collections = [verbs, nouns, adjectives, adverbs];

    collections.forEach(collection => {
      collection.forEach(model => {
        const promise = model.save();
        promises.push(promise);
      });
    });

    return Promise.all(promises);

    // come back
  }
});