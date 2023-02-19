import redis from "redis";
// process.env.REDIS_URL
const client = redis.createClient(process.env.REDIS_URL);
client.on("connect", () => console.log("Connected to Redis"));
client.on("error", (err) => console.error(err));

export default client;
