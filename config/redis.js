import redis from "redis";

export const client = redis.createClient(process.env.REDIS_URL);
client.set("key", "value", (err, reply) => {
  console.log(reply);
});

client.get("key", (err, reply) => {
  console.log(reply);
});

client.on("connect", () => console.log("Connected to Redis"));
client.on("error", (err) => console.error(err));
