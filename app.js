const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const indexRouter = require("./routes/index");
const { addUser, getUser } = require("./users");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("login", (username, callback) => {
    console.log(username);
    let { user, error } = addUser(socket.id, username);
    if (error) {
      callback(error);
    }
    console.log(user);
    callback();
  });
  socket.on("chat message", (msg) => {
    let user = getUser(socket.id);
    console.log(user);
    io.emit("chat message", `${user.name}:  ${msg}`);
    console.log("message: " + msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`listening in ${port}`);
});
