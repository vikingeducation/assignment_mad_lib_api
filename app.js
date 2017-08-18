const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");

app.use((req, res, next) => {
	if (mongoose.connection.readyState) {
		next();
	} else {
		require("./mongo")().then(() => next());
	}
});

app.use(passport.initialize());
app.use(passport.session());

app.get("/login", (req, res) => {
	// render login page
});

app.listen(3000, () => {
	console.log("Now listening...");
});
