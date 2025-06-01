/** @format */

import mongoose from "mongoose";

const exchangeInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    callTime: { type: String, required: true }, // e.g. "morning", "afternoon"
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ExchangeInquiry = mongoose.model(
  "ExchangeInquiry",
  exchangeInquirySchema
);
