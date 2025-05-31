import { Schema, model } from "mongoose";

const propertySchema = new Schema(
    {
        title: String,
        type: String,
        price: Number,
        state: String,
        city: String,
        areaSqFt: Number,
        bedrooms: Number,
        bathrooms: Number,
        amenities: [String],
        furnished: String,
        availableFrom: Date,
        listedBy: String,
        tags: [String],
        colorTheme: String,
        rating: Number,
        isVerified: Boolean,
        listingType: String,
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default model("Property", propertySchema);
