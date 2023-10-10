module.exports.index = (req, res, next) => {
  let username;
  if (req.session.user) {
    username = req.session.user.name;
  }
  res.render("index", { username: username });
};
