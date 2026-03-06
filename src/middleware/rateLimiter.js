import redisClient from "../lib/redis.js";

const MAX_REQUEST = 30;
const WINDOW_SECONDS = 60;

export async function rateLimiter(req, res, next) {
    const ip = req.ip || req.headers["x-forwarded-for"];
    const key = `rate:${ip}`; //atomic key

    try {
        const current = await redisClient.get(key);
        //first request in the window
        if (current === 1) {
            return res.status(429).json({ message: "Too many requests" });
        }
        //set the key with expiry
        await redisClient.set(key, 1, "EX", WINDOW_SECONDS);

        //attach headers so callers can see their message
        res.setHeader("X-RateLimit-Limit", MAX_REQUEST);
        res.setHeader("X-RateLimit-Remaining", MAX_REQUEST - current);
        res.setHeader("X-RateLimit-Reset", WINDOW_SECONDS);

        if (current > MAX_REQUEST) {
            const ttl = await redisClient.ttl(key);
            return res.status(429).json({ message: `Too many requests. Try again in ${ttl} seconds` });
            retryAfter: ttl;
        }
        next();
    } catch (err) {
        console.error("Rate limiter error:", err.message);
        next();
    }
}   