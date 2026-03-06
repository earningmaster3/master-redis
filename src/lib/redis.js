import { Redis } from "@upstash/redis";
import "dotenv/config";

const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Note: Upstash REST client doesn't use .on("connect") or .on("error") 
// because it's a stateless HTTP connection. 
// It will "just work" when you call methods on it.

console.log("✅ Upstash Redis (HTTP) initialized");

// await redisClient.set("foo", "bar");
// const val = await redisClient.get("foo");
// console.log("Retrieved value:", val);


export default redisClient;