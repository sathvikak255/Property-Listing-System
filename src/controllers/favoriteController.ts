import User from "../models/User.ts";
import { redis } from "../config/redis.ts";
import Property from "../models/Property.ts";
import { AuthedRequest } from "../middleware/auth.ts";
import { Response } from "express";
import { Types } from "mongoose";
import Favorite from "../models/Favorite.ts";
import mongoose from "mongoose";

// Add property to favorites

export const addFavorite = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const { propId } = req.body;
    if (!propId) {
      res.status(400).json({ message: "Property ID is required" });
      return;
    }

    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.favorites.includes(propId)) {
      user.favorites.push(new mongoose.Types.ObjectId(propId));
      await user.save();
    }

    res.status(200).json({ message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ message: "Error adding to favorites", error: err });
  }
};



// Get all favorites
// export const getFavorites = async (req: AuthedRequest, res: Response): Promise<void> => {
//   const userId = req.user?.id;
//   if (!userId) {
//     res.status(401).json({ message: "Unauthorized" });
//     return;
//   }

//   const key = `favorites:${userId}:${JSON.stringify(req.query)}`;
//   const cached = await redis.get(key);
//   if (cached) {
//     res.json(JSON.parse(cached));
//     return;
//   }

//   const user = await User.findById(userId).populate("favorites");
//   let favorites = user?.favorites || [];

//   const filters = req.query;
//   favorites = favorites.filter((fav: any) => {
//     return Object.entries(filters).every(([k, v]) => {
//       const value = fav[k];

//       if (v === undefined || v === null) return true;

//       const filterVal = String(v).toLowerCase();

//       if (Array.isArray(value)) {
//         return value.map((x: any) => String(x).toLowerCase()).includes(filterVal);
//       }

//       if (typeof value === "boolean") {
//         return value === (filterVal === "true");
//       }

//       if (typeof value === "number") {
//         return value === Number(v);
//       }

//       return String(value).toLowerCase() === filterVal;
//     });
//   });

//   await redis.set(key, JSON.stringify(favorites), { EX: 60 });

//   res.json(favorites);
// };

export const getFavorites = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const filters: any = {
      _id: { $in: user.favorites },
    };

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

    const favoriteProperties = await Property.find(filters);
    res.json(favoriteProperties);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

// Remove a favorite
export const removeFavorite = async (req: AuthedRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  user.favorites = user.favorites.filter(
    (fav) => fav.toString() !== req.params.id
  );
  await user.save();
  res.json({ message: "Property removed from favorites" });
};
