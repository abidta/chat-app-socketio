const Redis = require("ioredis");
const { RedisMessageStore } = require("../messageStore");

const redisClient = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASS,
  // tls:{},
});
const messageStore = new RedisMessageStore(redisClient);
module.exports = { redisClient, messageStore };
