require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const session = require("express-session");
const { randomBytes } = require("crypto");
const Redis = require("ioredis");
const redisClient = new Redis({
  port:process.env.REDIS_PORT,
  host:process.env.REDIS_HOST,
  username:process.env.REDIS_USERNAME,
  password:process.env.REDIS_PASS,
});
const indexRouter = require("./routes/index");
const { addUser, getUser } = require("./users");
const { RedisMessageStore } = require("./messageStore");
const messageStore = new RedisMessageStore(redisClient);

redisClient.on("error", (e) => {
  console.log(e.message, "err");
  redisClient.disconnect();
});
redisClient.on("end", (e) => {
  console.log(e);
});
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
});

let user = {};
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app.use(sessionMiddleware);
app.use("/", indexRouter);
io.engine.use(sessionMiddleware);
// io.engine.use((req,res,next)=>{
//   }

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
      console.log("kl");
      let userData = await getUser(req.session.user.id);
      console.log(userData);
      const message = {
        from: userData.name,
        value: msg,
      };
      try {
        socket.join("room1");
        io.to("room1").emit("chat message", {
          name: userData.name,
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

server.listen(port, () => {
  console.log(`listening in ${port}`);
});
