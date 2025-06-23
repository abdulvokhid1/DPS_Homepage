/** @format */

// models/Visitor.ts
// import mongoose from "mongoose";

// const visitorSchema = new mongoose.Schema({
//   visitorId: { type: String, required: true, unique: true },
//   visitedAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Visitor", visitorSchema);

// models/Visit.ts

import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  fingerprint: String,
  ip: String,
  country: String,
  region: String,
  city: String,
  device: String,
  browser: String,
  os: String,
  userAgent: String,
  visitedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Visitor ||
  mongoose.model("Visitor", visitorSchema);
