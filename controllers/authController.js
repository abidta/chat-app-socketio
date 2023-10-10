const { deleteUser } = require("../users");

module.exports.logout = (req, res) => {
  if (!req.session.user) {
    res.json("login first");
    return;
  }
  let userId = req.session.user.userId;
  req.session.destroy((err) => {
    console.log(err);
    if (!err) {
      deleteUser(userId);
      res.redirect("/");
      return;
    }
    return res.json("Something wrong");
  });
};
module.exports.getSession = (req, res) => {
  if (req.session.user) {
    res.json(req.session.user.name);
    return;
  }
  res.json(null);
};
