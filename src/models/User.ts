import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    favorites: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    recommendationsReceived: [
        {
            from: String, // sender's email
            property: { type: Schema.Types.ObjectId, ref: "Property" },
        },
    ],
    recommendationsSent: [
        {
            to: String, // recipient's email
            property: { type: Schema.Types.ObjectId, ref: "Property" }
        }
    ]
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    if (typeof this.password === "string") {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});


export default model("User", userSchema);
