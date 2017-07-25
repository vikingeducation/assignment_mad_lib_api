const url = require("url");
const express = require("express");
const app = express();
const SessionService = require("./session");

const _options = {
  loginUrl: "/login",
  rootUrl: "/",
  loginView: "sessions/new",
  unauthenticatedPaths: [
    "/login",
    "/logout",
    "/sessions",
    "/user/new",
    "/users"
  ]
};

// ----------------------------------------
// Authenticate Session
// ----------------------------------------
app.use((req, res, next) => {
  // No session ID?
  if (!req.session.sessionId) {
    // Go to next middleware
    next();
    return;
  }

  // If we have an ID
  // get the email and signature
  const [email, signature] = req.session.sessionId.split(":");

  // Find the user by email
  _options
    .findUserByEmail(email)
    .then(user => {
      // Is the signature the same as
      // our signature?
      if (signature === SessionService.createSignature(email)) {
        // If so, continue and
        // set the current user
        req.user = user;
        res.locals.currentUser = user;
        next();
      } else {
        // If not kick out the hacker
        req.flash("error", "You tampered with your session!");
        res.redirect(_options.loginUrl);
      }
    })
    .catch(next);
});

// ----------------------------------------
// API
// ----------------------------------------
app.use("/api", (req, res, next) => {
  // Get API token from query or body
  const token = req.query.token || req.body.token;

  // If we don't have a token
  // kick'em out
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // If we have a token find the
  // user by that token
  _options
    .findUserByToken(token)
    .then(user => {
      // Set the request user
      req.user = user;
      next();
    })
    .catch(next);
});

// ----------------------------------------
// Require Login/Logout
// ----------------------------------------
app.use((req, res, next) => {
  const reqUrl = url.parse(req.url).pathname;

  // Is the user logged in?
  const isLoggedIn = !!req.user;

  // Is this an authenticated route?
  const isAuthenticatedPath = !_options.unauthenticatedPaths.includes(reqUrl);

  // User can proceed if
  const canProceed =
    // They are logged in and route
    // is authenticated or
    (isLoggedIn && isAuthenticatedPath) ||
    // The path is unauthenticated
    !isAuthenticatedPath;

  // Redirect if cannot proceed
  canProceed ? next() : res.redirect(_options.loginUrl);
});

// ----------------------------------------
// New
// ----------------------------------------
const onNew = (req, res) => {
  // Redirect to root if already logged in
  req.user ? res.redirect(_options.rootUrl) : res.render(_options.loginView);
};
app.get("/login", onNew);
app.get("/sessions/new", onNew);

// ----------------------------------------
// Create
// ----------------------------------------
app.post("/sessions", (req, res, next) => {
  // Look for the user
  // to log in
  const { email, password } = req.body;

  // Use the function provided in
  // the options
  _options
    .findUserByEmail(email)
    .then(user => {
      // If we have a user
      if (user) {
        // Again using a function
        // from the options
        // If password is valid
        if (_options.validateUserPassword(user, password)) {
          // Sign in user
          const sessionId = SessionService.createSignedSessionId(user.email);
          req.session.sessionId = sessionId;
          res.redirect(_options.rootUrl);
        } else {
          // Bad password
          req.flash("error", "Invalid password");
          res.redirect(_options.loginUrl);
        }
      } else {
        // Redirect to login
        req.flash("error", "User email not found!");
        res.redirect(_options.loginUrl);
      }
    })
    .catch(next);
});

// ----------------------------------------
// Destroy
// ----------------------------------------
const onDestroy = (req, res) => {
  // Delete all keys and
  // redirect
  for (let key in req.session) {
    delete req.session[key];
  }
  req.method = "GET";
  res.redirect(_options.loginUrl);
};
app.get("/logout", onDestroy);
app.delete("/logout", onDestroy);
app.delete("/sessions", onDestroy);

module.exports = options => {
  // Register options
  for (let key in options) {
    _options[key] = options[key];
  }

  return app;
};
