const express = require("express");
const app = express();
const expressSession = require("express-session");
const flash = require("express-flash-messages");
const morgan = require("morgan");
const highlight = require("cli-highlight").highlight;
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models").User;
const expressHandlebars = require("express-handlebars");
const helpers = require("./helpers");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { localStrategy, bearerStrategy } = require("./strategies");
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
const morganToolKit = require("morgan-toolkit")(morgan);

const hbs = expressHandlebars.create({
  helpers: helpers,
  partialsDir: "views/",
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use((req, res, next) => {
  res.locals.siteTitle = "The Maddest of Libs";
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  expressSession({
    secret: "delicious",
    resave: false,
    saveUninitialized: true
  })
);

app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
});

app.use(flash());

app.use(methodOverride(getPostSupport.callback, getPostSupport.options));

app.use((req, res, next) => {
  req.session.backUrl = req.header("Referer") || "/";
  next();
});

app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("tiny"));
  app.use(morganToolKit());
}

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

app.use(passport.initialize());
app.use(passport.session());

passport.use("local", localStrategy);
passport.use("bearer", bearerStrategy);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(e => done(null, false));
});

const loggedInOnly = (req, res, next) => {
  return req.user ? next() : res.redirect("/login");
};

const loggedOutOnly = (req, res, next) => {
  return !req.user ? next() : res.redirect("/");
};

const usersRouter = require("./routers/users")({
  loggedInOnly,
  loggedOutOnly
});

app.get("/login", loggedOutOnly, (req, res) => {
  res.render("sessions/new");
});

const onLogout = (req, res) => {
  req.logout();
  req.method = "GET";
  res.redirect("/login");
};
app.get("/logout", loggedInOnly, onLogout);
app.delete("/logout", loggedInOnly, onLogout);

app.post(
  "/sessions",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.use("/", usersRouter);

app.use(
  "/api/v1",
  require("./routers/maddest_libs")(
    passport.authenticate("bearer", { session: false })
  )
);

app.get("/stories/new", loggedInOnly, (req, res) => {
  res.render("stories/new");
});
app.post("/stories", (req, res) => {
  let sentence;
  let nouns;
  let verbs;
  let adjectives;
  let adverbs;
  const newServer = app.listen(3050);
  const story = req.body.story;
  let nounMatches = 0;
  let nounMatch = /{{ noun }}/g.exec(story);
  while (nounMatch) {
    nounMatches++;
    nounMatch = /{{ noun }}/g.exec(story);
  }
  let verbMatches = 0;
  let verbMatch = /{{ verb }}/g.exec(story);
  while (verbMatch) {
    verbMatches++;
    verbMatch = /{{ verb }}/g.exec(story);
  }
  let adjectiveMatches = 0;
  let adjectiveMatch = /{{ adjective }}/g.exec(story);
  while (adjectiveMatch) {
    adjectiveMatches++;
    adjectiveMatch = /{{ adjective }}/g.exec(story);
  }
  let adverbMatches = 0;
  let adverbMatch = /{{ adverb }}/g.exec(story);
  while (nounMatch) {
    adverbMatches++;
    adverbMatch = /{{ adverb }}/g.exec(story);
  }
  request.get(
    "http://localhost:3050/api/v1/nouns",
    {
      count: nounMatches
    },
    (err, res, body) => {
      nouns = body;
    }
  );
  request.get(
    "http://localhost:3050/api/v1/verbs",
    {
      count: verbMatches
    },
    (err, res, body) => {
      verbs = body;
    }
  );
  request.get(
    "http://localhost:3050/api/v1/adjectives",
    {
      count: adjectiveMatches
    },
    (err, res, body) => {
      adjectives = body;
    }
  );
  request.get(
    "http://localhost:3050/api/v1/adverbs",
    {
      count: adverbMatches
    },
    (err, res, body) => {
      adverbs = body;
    }
  );
  request.post(
    "http://localhost:3050/api/v1/stories",
    {
      form: {
        words: nouns.concat(verbs.concat(adjectives.concat(adverbs))),
        sentence: story
      }
    },
    (err, res, body) => {
      sentence = body;
    }
  );
  res.end(sentence);
});

const port = process.env.PORT || process.argv[2] || 3000;
const host = "0.0.0.0";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}\n`);
});

if (require.main === module) {
  app.listen.apply(app, args);
}

app.use("/api", (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).json({ error: err });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render("errors/500", { error: err });
});

module.exports = app;
