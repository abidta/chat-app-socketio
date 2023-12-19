const { messageStore } = require("../config/redis");

module.exports.homePage = (req, res, next) => {
  let username;
  if (req.session?.user) {
    username = req.session.user.name;
  }
  res.render("index", { username: username });
};
module.exports.getAllMessages = (req, res, next) => {
  if (req.session?.user) {
    messageStore
      .findAllMessage()
      .then((messages) => {
        res.json(messages);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err.message);
      });
    return;
  }
  return res.status(401).json("login First");
};
