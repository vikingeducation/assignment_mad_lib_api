const express = require("express");
const app = express();

// bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// cookieSession
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

//flash
const flash = require("express-flash-messages");
app.use(flash());

// methodOverride
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");

app.use(
	methodOverride(
		getPostSupport.callback,
		getPostSupport.options // GET POST
	)
);

//Logging
const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);

// Use morgan middleware with
// custom format
if (process.env.NODE_ENV !== "test") {
	app.use(morganToolkit());
}

// mongoose
const mongoose = require("mongoose");
app.use((req, res, next) => {
	if (mongoose.connection.readyState) {
		next();
	} else {
		require("./mongo")().then(() => next());
	}
});

// Services
const passport = require("passport");
const localStrategy = require("./strategies/local");
const bearerStrategy = require("./strategies/bearer");
const User = require("./models").User;

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Use the strategy middlewares
passport.use(localStrategy);
passport.use(bearerStrategy);

// Serialize and deserialize the user
// with the user ID
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
	// Find the user in the database
	User.findById(id)
		.then(user => done(null, user))
		.catch(e => done(null, false));
});

// Routes
const usersRouter = require("./routers/users");
app.use("/", usersRouter);

// handlebars
const expressHandlebars = require("express-handlebars");
const helpers = require("./helpers");

const hbs = expressHandlebars.create({
	helpers: helpers,
	partialsDir: "views/",
	defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Server
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
	console.log(`Listening: http://${host}:${port}\n`);
});

if (require.main === module) {
	app.listen.apply(app, args);
}

// Error Handling
app.use("/api", (err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}
	res.status(500).json({ error: err.stack });
});

app.use((err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}
	res.status(500).render("errors/500", { error: err.stack });
});

module.exports = app;
