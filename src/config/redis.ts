import { createClient } from "redis";
export const redis = createClient({ url: process.env.REDIS_URL });
redis.on("error", e => console.error("Redis error", e));
export const connectRedis = async () => {
    try {
        if (!redis.isOpen) await redis.connect();
        console.log("Redis connected");
    } catch (err) {
        console.error("Failed to connect Redis:", err);
        process.exit(1);
    }
};