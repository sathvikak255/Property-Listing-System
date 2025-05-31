import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

const genToken = (id: string) =>
    jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const register = async (req: Request, res: Response): Promise<void> => {
    console.log("Hit register route");
    try {
        const user = await User.create(req.body);
        res.json({ token: genToken(user._id.toString()) });
    } catch (err: any) {
        if (err.code === "E11000") {
            res.status(400).json({ message: "Email already registered" });
            return;
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    console.log("Hit login route");
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
        res.status(400).json({ message: "Invalid credentials" });
        return; // ✅ EXIT EARLY after responding
    }

    res.json({ token: genToken(user._id.toString()) });
};
