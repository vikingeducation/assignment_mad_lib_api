const repl = require('repl').start({});
const faker = require('faker');
const mongoose = require('mongoose');
const models = require('./models');
const helpers = require('./helpers');
const md5 = require('md5');
const uuid = require('uuid');


require('./mongo')().then(() => {

  // ----------------------------------------
  // Models/Helpers
  // ----------------------------------------
  repl.context.models = models;
  repl.context.helpers = helpers;


  // ----------------------------------------
  // Mongoose
  // ----------------------------------------
  Object.keys(models).forEach((key) => {
    repl.context[key] = mongoose.model(key);
  });


  // ----------------------------------------
  // Libs
  // ----------------------------------------
  repl.context.faker = faker;
  repl.context.md5 = md5;
  repl.context.uuid = uuid;


  // ----------------------------------------
  // Logging
  // ----------------------------------------
  repl.context.lg = console.log;
});
