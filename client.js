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
const Promise = require("bluebird");
app.use(morganToolkit());

const urlFor = (type, token) => {
  const apiUrl = "http://localhost:3000/api/v1/";
  return `${apiUrl}${type}?access_token=${token}`;
};

// Route Handlers
app.get("/", (req, res) => {
  res.render("client/index");
});

app.post("/prepare", (req, res) => {
  const token = req.body.token;
  const promises = [
    rp.get(urlFor("nouns", token)),
    rp.get(urlFor("verbs", token)),
    rp.get(urlFor("adverbs", token)),
    rp.get(urlFor("adjectives", token))
  ];
  Promise.all(promises)
    .spread((nouns, verbs, adverbs, adjectives) => {
      const words = [
        { name: "Nouns", words: JSON.parse(nouns) },
        { name: "Verbs", words: JSON.parse(verbs) },
        { name: "Adverbs", words: JSON.parse(adverbs) },
        { name: "Adjectives", words: JSON.parse(adjectives) }
      ];
      res.render("client/build", { words, token });
    })
    .catch(e => res.end(e.stack));
});

app.post("/build", (req, res) => {
  let { token, template, words } = req.body;
  words = words.split(" ");
  const formData = { form: { words, template } };
  request.post(urlFor("sentences", token), formData, (err, r, body) => {
    const sentence = JSON.parse(body).sentence;
    res.render("client/display", { sentence });
  });
});

app.listen(3030, () => console.log("Up and running!"));
