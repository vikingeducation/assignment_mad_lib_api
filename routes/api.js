const router = require('express').Router();
const { users, madlibs } = require('../controllers');
const passport = require('../auth/passport');

router.get('/users/:id', users.view);

router.post('/users', users.create);

router.post('/madlibs', passport.authenticate('bearer', { session: false }), madlibs.create);

module.exports = router;
