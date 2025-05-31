import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import { redis } from "./config/redis.js";
import { router } from "./routes/index.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

const start = async () => {
    await connectDB();

    if (!redis.isOpen) {
        await redis.connect();
        console.log("Redis connected");
    } else {
        console.log("Redis was already connected");
    }

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};
process.on("SIGINT", async () => {
    await redis.quit();
    process.exit(0);
});
start();
