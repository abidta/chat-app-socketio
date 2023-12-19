const { randomBytes } = require("crypto");
const { messageStore } = require("../config/redis");
const { addUser, getUser } = require("../users");

const socket = (io) => {
  io.on("connection", (socket) => {
    let req = socket.request;
    console.log("a user connected");
    socket.use((event, next) => {
      if (req.session.user && event[0] === "login") {
        return;
      }
      console.log(event[2], "use");
      next();
    });
    socket.on("login", async (username, callback) => {
      user = {
        isLoggedIn: true,
        name: username,
        id: randomBytes(8).toString("hex"),
      };
      let { error } = addUser(user.id, username);
      if (error) {
        return callback(error);
      }
      req.session.user = user;
      req.session.save();
      console.log(req.session.user.name + "  logged");
      socket.join("room1");
      messageStore
        .findAllMessage()
        .then((allMessages) => {
          callback((err = null), allMessages);
        })
        .catch((err) => {
          callback(err.message);
        });
    });
    socket.on("chat message", async (msg, color) => {
      if (req.session.user) {
        console.log(req.session.user, "kl");
        //let userData = await getUser(req.session.user.id);
        //console.log(userData);
        const message = {
          from: req.session.user.name,
          value: msg,
        };
        try {
          socket.join("room1");
          io.to("room1").emit("chat message", {
            name: req.session.user.name,
            msg,
            color,
          });
          messageStore.saveMessage(message);
        } catch (err) {
          console.log(err);
        }
      }
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
module.exports = socket;
