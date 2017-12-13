const express = require('express');
const router = express.Router();
const { loggedInOnly, loggedOutOnly } = require('../services/session');
const User = require('../models').User;

const onShow = (req, res) => {
  const user = req.user;
  res.render('users/show', { user });
};

router.get('/', loggedInOnly, onShow);
router.get('/user', loggedInOnly, onShow);

router.get('/new', loggedOutOnly, (req, res) => {
  res.render('users/new');
});

router.post('/', loggedOutOnly, (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const user = new User({ firstName, lastName, email, password });

  user.save()
    .then(() => {
      req.login(user, (err) => {
        if (err) throw err;
        return res.redirect('/users');
      });
    })
    .catch(e => {
      if (e.errors) {
        Object.keys(e.errors).forEach((key) => {
          req.flash('error', `${ e.errors[key].message }`);
          res.redirect('back');
        });
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;
