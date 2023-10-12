const CONVERSATION_TTL = 24 * 60 * 60;
class RedisMessageStore {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }
  saveMessage(message) {
    let value = JSON.stringify(message);
    this.redisClient
      .multi()
      .rpush("message", value)
      .expire("message", CONVERSATION_TTL)
      .exec();
  }
  findAllMessage() {
    return this.redisClient.lrange("message", 0, -1);
  }
}
module.exports = { RedisMessageStore };
