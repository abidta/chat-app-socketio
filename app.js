const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const indexRouter = require("./routes/index");
const { addUser, getUser , deleteUser } = require("./users");

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
    let {  error } = addUser(socket.id, username);
    if (error) {
      return callback(error);
    }
    callback();
  });
  socket.on("chat message", (msg,color) => {
    let user = getUser(socket.id);
    io.emit("chat message", {name:user.name,msg,color});
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    deleteUser(socket.id)
  });
});

server.listen(port, () => {
  console.log(`listening in ${port}`);
});
