module.exports.index = (req, res, next) => {
  let username;
  if (req.session.user) {
    username = req.session.user.name;
  }
  console.log("api");
  res.render("index", { username: username });
};
