const { User } = require("../models");
module.exports = {
  createUser: async function(req, res) {
    let existingUser;
    try {
      existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.redirect("/login");
      }
    } catch (e) {
      return res.json({ message: e.message });
    }
    const params = req.body;
    try {
      const user = await User.create(params);
      return res.redirect("/");
    } catch (e) {
      return res.json({ message: e.message });
    }
  }
};
