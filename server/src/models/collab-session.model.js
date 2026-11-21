import mongoose from "mongoose";

const creatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    splitPercent: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false },
);

const collabSessionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    creatorAName: { type: String, required: true, trim: true },
    creatorBName: { type: String, trim: true, default: "" },
    productName: { type: String, trim: true, default: "" },
    price: { type: Number, min: 0, default: 0 },
    platformFeePercent: { type: Number, min: 0, max: 100, default: 10 },
    creatorASplit: { type: Number, min: 0, max: 100, default: 60 },
    creatorBSplit: { type: Number, min: 0, max: 100, default: 40 },
    settlementCycleDays: { type: Number, default: 7 },
    status: {
      type: String,
      enum: ["invite_created", "joined", "configured", "published"],
      default: "invite_created",
    },
    creators: { type: [creatorSchema], default: [] },
  },
  { timestamps: true },
);

export const CollabSession = mongoose.model("CollabSession", collabSessionSchema);
