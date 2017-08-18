const express = require("express");
const app = express();
const request = require("request");
const rp = require("request-promise");

// Post Data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Handlebars
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application"
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Logging
const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);
app.use(morganToolkit());

// Route Handlers

app.get("/", (req, res) => {
  res.render("client/index");
});

app.post("/prepare", async (req, res) => {
  const token = req.body.token;
  try {
    const promises = [
      rp.get(`http://localhost:3000/api/v1/nouns?access_token=${token}`),
      rp.get(`http://localhost:3000/api/v1/verbs?access_token=${token}`),
      rp.get(`http://localhost:3000/api/v1/adverbs?access_token=${token}`),
      rp.get(`http://localhost:3000/api/v1/adjectives?access_token=${token}`)
    ];
    let [nouns, verbs, adverbs, adjectives] = await Promise.all(promises);
    [nouns, verbs, adverbs, adjectives] = [
      nouns,
      verbs,
      adverbs,
      adjectives
    ].map(type => {
      JSON.parse(type);
    });
    const words = [
      { name: "Nouns", words: nouns },
      { name: "Verbs", words: verbs },
      { name: "Adverbs", words: adverbs },
      { name: "Adjectives", words: adjectives }
    ];
    console.log(words);
    res.render("client/build", { words, token });
  } catch (error) {
    res.end(error.stack);
  }
});

app.post("/build", (req, res) => {
  let { token, template, words } = req.body;
  words = words.split(" ");
  const url = `http://localhost:3000/api/v1/sentences?access_token=${token}`;
  const formData = { form: { words, template } };
  request.post(url, formData, (err, r, body) => {
    const sentence = JSON.parse(body).sentence;
    res.render("client/display", { sentence });
  });
});

app.listen(3030, () => console.log("Up and running!"));
