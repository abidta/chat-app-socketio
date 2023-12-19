require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { redisClient } = require("./config/redis");
const indexRouter = require("./routes/index");


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
const TTL_SESS = 1 * 24 * 60 * 60;
let user = {};

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
  ttl: TTL_SESS,
});
redisClient.on("error", (e) => {
  console.log(e.message, "err");
  redisClient.disconnect();
  process.exit(1)
});
redisClient.on("end", (e) => {
  console.log(e);
});

const sessionMiddleware = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app.use(sessionMiddleware);
app.use("/", indexRouter);

io.engine.use(sessionMiddleware);
// io.engine.use((req,res,next)=>{
//   }

require("./controllers/socket")(io)
server.listen(port, () => {
  console.log(`listening in ${port}`);
});
