const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const passport = require('passport');
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

app.use(passport.initialize());
app.use(passport.session());

const { localAuth } = require('./auth');
localAuth(passport);

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
app.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.set('view engine', 'handlebars');
app.use(loginMiddleware);

app.listen(3000, '0.0.0.0', (req, res) => {
  console.log('listening on port 3000');
});
