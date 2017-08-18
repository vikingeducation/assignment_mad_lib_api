const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const passport = require('./auth/passport');
const { loginMiddleware } = require('./session/Session.js');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(
  session({
    secret: '123fljwejflkkwjelk23jlkf23fl2k3jl23kfjlk23j329f4',
    resave: true,
    saveUninitialized: true
  })
);

// initialize our passport
app.use(passport.initialize());
app.use(passport.session());

// call our methods
require('./auth/passport').auth();

mongoose.Promise = Promise;

const beginConnection = mongoose.connect(process.env.DB_URL, {
  useMongoClient: true
});

beginConnection
  .then(db => {
    console.log('DB CONNECTION SUCCESS');
  })
  .catch(err => {
    console.error(err);
  });

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: 'views/partials' }));

// auth routes

app.set('view engine', 'handlebars');
app.use(loginMiddleware);

const port = process.env.PORT || process.argv[2] || 3000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}\n`);
});

// If we're running this file directly
// start up the server
if (require.main === module) {
  app.listen.apply(app, args);
}

module.exports = app;
