const { User } = require('../models');

module.exports = {
  view: async function(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      return res.json({ result: user });
    } catch (e) {
      return res.json({ message: e.message });
    }
  },

  create: async function(req, res) {
    let existingUser;
    try {
      existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.redirect('/login');
      }
    } catch (e) {
      return res.json({ message: e.message });
    }
    const params = req.body;
    try {
      const user = await User.create(params).get();
      return res.redirect('/');
    } catch (e) {
      return res.json({ message: e.message });
    }
  }
};
