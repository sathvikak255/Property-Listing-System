import { Schema, model } from "mongoose";

const favoriteSchema = new Schema(
  {
    property: { type: Object, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default model("Favorite", favoriteSchema);