const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const session = require("express-session");
const indexRouter = require("./routes/index");
const { addUser, getUser } = require("./users");
const { randomBytes } = require("crypto");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

const sessionMiddleware = session({
  secret: "CAT",
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
    next();
  });
  socket.on("login", (username, callback) => {
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
    socket.join("room1")
    callback();
  });
  socket.on("chat message", async (msg, color) => {
    let userData = await getUser(req.session.user.id);
    try {
      io.to("room1").emit("chat message", { name: userData.name, msg, color });
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`listening in ${port}`);
});
