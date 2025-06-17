/** @format */

// models/Visitor.ts
// import mongoose from "mongoose";

// const visitorSchema = new mongoose.Schema({
//   visitorId: { type: String, required: true, unique: true },
//   visitedAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Visitor", visitorSchema);

import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
  fingerprint: { type: String, required: true, unique: true },
  ip: String,
  country: String,
  region: String,
  city: String,
  visitedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Visitor", VisitorSchema);
