const express = require("express");
const router = express.Router();
const h = require("../helpers");
const { User } = require("../models");


function api(passport) {
  
  router.get('/', (req, res) => {
    res.json({api: "api"})
  })
  return router;
}

module.exports = api