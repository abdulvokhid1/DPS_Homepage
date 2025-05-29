/** @format */

import mongoose from "mongoose";

const exchangeInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    exchange: { type: String, required: true },
    experience: { type: String, required: true }, // e.g. "new", "1 year", etc.
    callTime: { type: String, required: true }, // e.g. "morning", "afternoon"
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ExchangeInquiry = mongoose.model(
  "ExchangeInquiry",
  exchangeInquirySchema
);
