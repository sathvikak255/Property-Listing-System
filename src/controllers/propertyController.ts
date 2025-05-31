import Property from "../models/Property.ts";
import { AuthedRequest } from "../middleware/auth.ts";
import { Response } from "express";
import { redis } from "../config/redis.ts";

export const list = async (req: AuthedRequest, res: Response): Promise<void> => {
    const key = JSON.stringify(req.query);
    const cached = await redis.get(key);
    if (cached) {
        res.json(JSON.parse(cached));
        return;
    }

    const filters: any = {};
    // Object.entries(req.query).forEach(([k, v]) => (filters[k] = v));

    for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === "string" && value.includes("-")) {
            const [min, max] = value.split("-").map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                filters[key] = { $gte: min, $lte: max };
            }
        } else if (key.endsWith("_gt")) {
            filters[key.replace("_gt", "")] = { $gt: Number(value) };
        } else if (key.endsWith("_lt")) {
            filters[key.replace("_lt", "")] = { $lt: Number(value) };
        } else if (key.endsWith("_gte")) {
            filters[key.replace("_gte", "")] = { $gte: Number(value) };
        } else if (key.endsWith("_lte")) {
            filters[key.replace("_lte", "")] = { $lte: Number(value) };
        } else {
            filters[key] = value;
        }
    }

    const props = await Property.find(filters);
    await redis.set(key, JSON.stringify(props), { EX: 60 });
    res.json(props);
};

export const create = async (req: AuthedRequest, res: Response): Promise<void> => {
    const prop = await Property.create({ ...req.body, createdBy: req.user!.id });
    res.json(prop);
};

export const update = async (req: AuthedRequest, res: Response): Promise<void> => {
    const prop = await Property.findById(req.params.id);
    if (!prop || !prop.createdBy || prop.createdBy.toString() !== req.user!.id) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    Object.assign(prop, req.body);
    await prop.save();
    res.json(prop);
};

export const remove = async (req: AuthedRequest, res: Response): Promise<void> => {
    const prop = await Property.findById(req.params.id);
    if (!prop || !prop.createdBy || prop.createdBy.toString() !== req.user!.id) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    await prop.deleteOne();
    res.json({ message: "Deleted" });
};
