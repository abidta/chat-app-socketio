const express = require("express");
const router = express.Router();
const { deleteUser } = require("../users");

router.get("/", (req, res, next) => {
  let username;
  if (req.session.user) {
    username = req.session.user.name;
  }
  res.render("index", { username: username });
});
router.get("/get-session", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user.name);
    return;
  }
  res.json(null);
});
router.post("/logout", (req, res) => {
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
});
//for testing..
router.get("/api", (req, res) => {
  res.send("hello world");
});

module.exports = router;
