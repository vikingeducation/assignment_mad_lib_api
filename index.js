const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const { loginMiddleware } = require('./session/Session.js');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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
app.use(
  expressSession({
    secret: process.env.secret || 'keyboard cat',
    saveUninitialized: false,
    resave: false
  })
);

app.use('/', require('./routes/index'));

app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: 'views/partials' }));
app.set('view engine', 'handlebars');
app.use(loginMiddleware);

app.listen(3000, '0.0.0.0', (req, res) => {
  console.log('listening on port 3000');
});
