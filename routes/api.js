const router = require('express').Router();
const { users, madlibs } = require('../controllers');
const passport = require('../auth/passport');

router.get('/users/:id', users.view);

router.post('/users', users.create);

// passport.authenticate('bearer', { session: false })

router.post('/madlibs', madlibs.create);

module.exports = router;
