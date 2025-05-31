import csv from "csvtojson";
import Property from "../models/Property.js";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // This assumes dataset.csv is in the same dist directory level as utils/
    const csvFilePath = path.resolve(__dirname, "../dataset.csv");
    try {
        await connectDB();
        console.log("MongoDB connected");

        const jsonArray = await csv().fromFile(csvFilePath);

        const formatted = jsonArray.map((r: any) => ({
            title: r.title,
            price: parseFloat(r.price),
            location: r.location,
            bedrooms: parseInt(r.bedrooms),
            state: r.state,
            city: r.city,
            areaSqFt: parseFloat(r.areaSqFt),
            type: r.type,
            availableFrom: r.availableFrom ? new Date(r.availableFrom) : null,
            tags: r.tags?.split("|") ?? [],
            colorTheme: r.colorTheme,
            bathrooms: parseInt(r.bathrooms),
            area: parseFloat(r.area),
            amenities: r.amenities?.split("|") ?? [],
            rating: parseFloat(r.rating),
            isVerified: r.isVerified === "true",
            listingType: r.listingType,
            description: r.description,
            createdBy: new mongoose.Types.ObjectId(), // dummy user ID
        }));

        try {
            await Property.deleteMany({});
            await Property.insertMany(formatted);
            console.log("Seeded DB");
        } catch (err) {
            console.error("Seeding error:", err);
        } finally {
            process.exit();
        }
    }
    catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }

})();
// This script seeds the MongoDB database with property data from a CSV file.
// It connects to the database, reads the CSV file, formats the data, and inserts it into the Property collection.