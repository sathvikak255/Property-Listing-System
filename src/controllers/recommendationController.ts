import User from "../models/User.ts";
import Property from "../models/Property.ts";
import { AuthedRequest } from "../middleware/auth.ts";
import { Response } from "express";
import { Types } from "mongoose";

// Define a proper type for recommendations
interface Recommendation {
    from?: String;
    to?: String;
    property: Types.ObjectId;
}

export const recommend = async (req: AuthedRequest, res: Response): Promise<void> => {
    const sender = await User.findById(req.user?.id);
    const { recipientEmail = "", propId = "" } = req.body;

    if (!sender || !recipientEmail || !propId) {
        res.status(400).json({ message: "Missing data" });
        return;
    }

    const property = await Property.findById(propId);
    if (!property) {
        res.status(404).json({ message: "Property not found" });
        return;
    }

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
        res.status(404).json({ message: "Recipient not found" });
        return;
    }

    // Check if already recommended by this sender to the same recipient
    const alreadyRecommended = sender.recommendationsSent.some(
        (rec) =>
            (rec.to ?? "") === recipient.email &&
            rec.property?.toString() === property._id.toString()
    );


    if (alreadyRecommended) {
        res.status(409).json({ message: "Already recommended by you" });
        return;
    }

    // Push to both sender and recipient lists
    const recommendation: Recommendation = {
        from: sender.email!,
        to: recipient.email!,
        property: property._id,
    };

    sender.recommendationsSent.push(recommendation);
    recipient.recommendationsReceived.push(recommendation);

    // Save both users
    await sender.save();
    await recipient.save();

    res.status(201).json({ message: "Recommendation sent successfully!" });
};

// export const getRecommendations = async (req: AuthedRequest, res: Response): Promise<void> => {
//     const user = await User.findById(req.user?.id).populate(
//         "recommendationsReceived.property",
//         "title location price"
//     );
//     if (!user) {
//         res.status(401).json({ message: "Unauthorized" });
//         return;
//     }

//     res.json(user.recommendationsReceived);
// };

export const getRecommendations = async (req: AuthedRequest, res: Response): Promise<void> => {
    const user = await User.findById(req.user?.id)
        .populate("recommendationsReceived.property");  // Full property object

    if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    // Map to desired format: from, property (with all details)
    const result = user.recommendationsReceived.map((rec) => ({
        from: rec.from,
        property: rec.property  // full populated document
    }));

    res.json(result);
};


export const getSentRecommendations = async (req: AuthedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const user = await User.findById(userId).populate(
        "recommendationsSent.property"
    );

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.json(user.recommendationsSent);
};
