import redisClient from "../lib/redis.js";
import crypto from "crypto";

const SESSION_TTL = 60 * 60;
const SESSION_PREFIX = "session:";

//here it will generate a random session id

export function generateToken() {
    return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId, userData = {}) {

    const token = generateToken();
    const key = SESSION_PREFIX + token;

    await redisClient.set(
        key,
        JSON.stringify({ userId, ...userData, createdAt: Date.now() }),
        { EX: SESSION_TTL }
    )

    return token;
}

export async function getSession(token) {

    if (!token) return null;

    const key = SESSION_PREFIX + token;
    const data = await redisClient.get(key);
    if (!data) return null;
    await redisClient.expire(key, SESSION_TTL);
    return JSON.parse(data);
}

export async function destroySession(token) {
    if (!token) return;
    const key = SESSION_PREFIX + token;
    await redisClient.del(key);
}

export async function sessionMiddleware(req, res, next) {
    const token = req.headers["x-session-token"]

    if (token) {
        try {
            req.session = await getSession(token);
            req.sessionToken = token;
        } catch (err) {
            console.error("session read error: ", err.message)
            return next(err);
        }
    }
    next();
}


