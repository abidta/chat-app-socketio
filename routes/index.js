const express = require("express");
const router = express.Router();
const { homePage, getAllMessages } = require("../controllers/indexController");
const { logout, getSession } = require("../controllers/authController");

router.route("/").get(homePage);
router.route("/get-messages").get(getAllMessages);
router.route("/get-session").get(getSession);
router.route("/logout").post(logout);
//for testing..
router.get("/api", (req, res) => {
  res.send("hello world");
});

module.exports = router;
