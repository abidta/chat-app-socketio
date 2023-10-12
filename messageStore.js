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
    return new Promise((resolve, reject) => {
      this.redisClient.lrange("message", 0, -1).then((data)=>{
        resolve(data)
      }).catch((err)=>[
        reject(err)
      ])
      
    })
     
  }
}
module.exports = { RedisMessageStore };
