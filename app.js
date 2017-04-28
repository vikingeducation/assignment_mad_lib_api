const express = require("express");
const app = express();

// ----------------------------------------
// App Locals
// ----------------------------------------
app.use((req, res, next) => {
  res.locals.siteTitle = "Mad Lib API";
  next();
});

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "asdf1234567890qwer"]
  })
);

app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
});

// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require("express-flash-messages");
app.use(flash());

// ----------------------------------------
// Method Override
// ----------------------------------------
app.use((req, res, next) => {
  let method;
  if (req.query._method) {
    method = req.query._method;
    delete req.query._method;
    for (let key in req.query) {
      req.body[key] = decodeURIComponent(req.query[key]);
    }
  } else if (typeof req.body === "object" && req.body._method) {
    method = req.body._method;
    delete req.body._method;
  }

  if (method) {
    method = method.toUpperCase();
    req.method = method;
  }

  next();
});

// ----------------------------------------
// Referrer
// ----------------------------------------
app.use((req, res, next) => {
  req.session.backUrl = req.header("Referer") || "/";
  next();
});

// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require("morgan");
const highlight = require("cli-highlight").highlight;

// Add :data format token
// to `tiny` format
let format = [
  ":separator",
  ":newline",
  ":method ",
  ":url ",
  ":status ",
  ":res[content-length] ",
  "- :response-time ms",
  ":newline",
  ":newline",
  ":data",
  ":newline",
  ":separator",
  ":newline",
  ":newline"
].join("");

// Use morgan middleware with
// custom format
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(format));
}

// Helper tokens
morgan.token("separator", () => "****");
morgan.token("newline", () => "\n");

// Set data token to output
// req query params and body
morgan.token("data", (req, res, next) => {
  if (/\.[\w]+$/.test(req.url)) {
    return "";
  }

  let data = [];
  ["query", "params", "body", "session", "user"].forEach(key => {
    if (req[key]) {
      let capKey = key[0].toUpperCase() + key.substr(1);
      let value = JSON.stringify(req[key], null, 2);
      data.push(`${capKey}: ${value}`);
    }
  });
  data = highlight(data.join("\n"), {
    language: "json",
    ignoreIllegals: true
  });
  return `${data}`;
});

// ----------------------------------------
// Mongoose
// ----------------------------------------
const mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

// ----------------------------------------
// Services
// ----------------------------------------
const authService = require("./services/auth");
const User = require("./models").User;

app.use(
  authService({
    findUserByEmail: email => {
      return User.findOne({ email: email });
    },
    findUserByToken: token => {
      return User.findOne({ token: token });
    },
    validateUserPassword: (user, password) => {
      return user.validatePassword(password);
    }
  })
);

// ----------------------------------------
// Routes
// ----------------------------------------
const usersRouter = require("./routers/users");
app.use("/", usersRouter);

const madLibRouter = require("./routers/mad_lib");
app.use("/api/v1", madLibRouter);

// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require("express-handlebars");
const helpers = require("./helpers");

const hbs = expressHandlebars.create({
  helpers: helpers.registered,
  partialsDir: "views/",
  defaultLayout: "main"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}\n`);
});

// If we're running this file directly
// start up the server
if (require.main === module) {
  app.listen.apply(app, args);
}

// ----------------------------------------
// Error Handling
// ----------------------------------------
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
