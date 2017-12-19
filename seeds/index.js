const mongoose = require('mongoose');
const models = require('./../models');
const mongooseeder = require('mongooseeder');


Object.keys(models).forEach((modelName) => {
  global[modelName] = mongoose.model(modelName);
});


const seeds = () => {
  let users = [];

  // ----------------------------------------
  // Creating Users
  // ----------------------------------------
  let p = User.create({
    fname: 'Foo',
    lname: 'Bar',
    email: 'foobar@gmail.com',
    password: 'password'
  });


  // ----------------------------------------
  // Finish
  // ----------------------------------------
  const promises = [p];
  return Promise.all(promises)
    .then(() => console.log())
    .catch((e) => { throw e; });
};


const env = process.env.NODE_ENV || 'development';
const config = require('./../config/mongoose')[env];

let mongodbUrl = config.use_env_variable ?
  process.env[config.use_env_variable] :
  `mongodb://${ config.host }/${ config.database }`;


mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  models: models,
  clean: true,
  mongoose: mongoose,
  seeds: seeds
})






