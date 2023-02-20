import redis from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

export default client;
