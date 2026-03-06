import redis from "ioredis";

const redisClient = new redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    lazyConnect: true,
});

redisClient.on("connect", () => {
    console.log("✅ Redis connected");
});

redisClient.on("error", (error) => {
    console.log("❌ Redis error", error);
});

export default redisClient;