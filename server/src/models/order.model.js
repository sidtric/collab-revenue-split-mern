import mongoose from "mongoose";

const ledgerEntrySchema = new mongoose.Schema(
  {
    owner: { type: String, required: true },
    type: { type: String, enum: ["fee", "credit"], required: true },
    amount: { type: Number, required: true, min: 0 },
    note: { type: String, default: "" },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, index: true },
    buyerName: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    creatorAName: { type: String, required: true, trim: true },
    creatorBName: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    platformFeeAmount: { type: Number, required: true, min: 0 },
    netAmount: { type: Number, required: true, min: 0 },
    settlementDate: { type: Date, required: true },
    settlementStatus: {
      type: String,
      enum: ["pending", "settled"],
      default: "pending",
    },
    ledger: { type: [ledgerEntrySchema], default: [] },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
