import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    splitPercent: { type: Number, required: true, min: 0, max: 100 },
    walletId: { type: String, default: "" },
  },
  { _id: false },
);

const collaborativeProductSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    platformFeePercent: { type: Number, required: true, min: 0, max: 100 },
    collaborators: {
      type: [collaboratorSchema],
      validate: {
        validator(collaborators) {
          const total = collaborators.reduce((sum, item) => sum + item.splitPercent, 0);
          return collaborators.length === 2 && total === 100;
        },
        message: "Exactly two collaborators are required and split must total 100",
      },
    },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true },
);

export const CollaborativeProduct = mongoose.model(
  "CollaborativeProduct",
  collaborativeProductSchema,
);
