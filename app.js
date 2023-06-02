const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const indexRouter = require("./routes/index");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use("/", indexRouter);
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    console.log("message: " + msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`listening in ${port}`);
});
