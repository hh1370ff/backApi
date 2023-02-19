import redis from "redis";
// process.env.REDIS_URL
export const client = redis.createClient();
client.on("connect", () => console.log("Connected to Redis"));
client.on("error", (err) => console.error(err));
// client.set("key", "value", (err, reply) => {
//   console.log(reply);
// });

// client.get("key", (err, reply) => {
//   console.log(reply);
// });
