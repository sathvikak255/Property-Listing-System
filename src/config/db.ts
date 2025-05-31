import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables.");
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
