import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthedRequest extends Request {
    user?: { id: string };
}

export const protect = (
    req: AuthedRequest,
    res: Response,
    next: NextFunction
): void | Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token" });
        return;
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
    return;
    // next();
};
