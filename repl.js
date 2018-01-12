const mongoose = require('mongoose');
const repl = require('repl').start({});
const models = require('./models');
const helpers = require('./helpers');
const md5 = require('md5');
const uuid = require('uuid');

require('./mongo')().then(() => {
  repl.context.models = models;
  repl.context.helpers = helpers;

  Object.keys(models).forEach(modelName => {
    repl.context[modelName] = mongoose.model(modelName);
  });

  repl.context.md5 = md5;
  repl.context.uuid = uuid;

  repl.context.lg = data => console.log(data);
});
