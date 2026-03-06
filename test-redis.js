import redisClient from "./src/lib/redis.js";

async function test() {
    try {
        const key = "test-key";
        console.log("Setting key...");
        await redisClient.set(key, "Hello Upstash!");
        const val = await redisClient.get(key);
        console.log("Retrieved value:", val);

        console.log("Testing INCR...");
        const count = await redisClient.incr("test-counter");
        console.log("Current counter:", count);

        console.log("✅ Connection successful!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Connection failed:", err);
        process.exit(1);
    }
}

test();
