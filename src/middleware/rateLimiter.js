import redisClient from "../lib/redis.js";

const MAX_REQUEST = 30;
const WINDOW_SECONDS = 60;

export async function rateLimiter(req, res, next) {
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const key = `rate:${ip}`;

    try {
        // Use INCR to atomatically increment the count
        const current = await redisClient.incr(key);

        // If it's the first request in this window, set expiration
        if (current === 1) {
            await redisClient.expire(key, WINDOW_SECONDS);
        }
        const ttl = await redisClient.ttl(key);

        // Set RateLimit headers
        res.setHeader("X-RateLimit-Limit", MAX_REQUEST);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUEST - current));
        res.setHeader("X-RateLimit-Reset", ttl > 0 ? ttl : WINDOW_SECONDS);

        if (current > MAX_REQUEST) {
            res.setHeader("Retry-After", ttl);
            return res.status(429).json({
                message: `Too many requests. Try again in ${ttl} seconds`,
                retryAfter: ttl
            });
        }

        next();
    } catch (err) {
        console.error("Rate limiter error:", err.message);
        // On redis error, we usually want to let the request through in production 
        // to avoid blocking users if the cache is down.
        next();
    }
}   