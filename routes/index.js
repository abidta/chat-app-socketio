const express = require("express");
const router = express.Router();
const { index } = require("../controllers/indexController");
const { logout, getSession } = require("../controllers/authController");

router.route("/").get(index);
router.route("/get-session").get(getSession);
router.route("/logout").post(logout);
//for testing..
router.get("/api", (req, res) => {
  res.send("hello world");
});

module.exports = router;
