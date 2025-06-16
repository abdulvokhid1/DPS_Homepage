/** @format */

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },

    password: {
      type: String,
      required: function (this: any) {
        return this.provider === "local";
      },
    },

    name: { type: String, required: true },

    phone: {
      type: String,
      required: function (this: any) {
        return this.provider === "local";
      },
    },
    note: { type: String, default: "" },

    role: { type: String, default: "user" },
    provider: { type: String, default: "local" },
    //     // ✅ Email verification fields
    verified: { type: Boolean, default: false },
    verifyCode: { type: String },
    verifyCodeExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", UserSchema);
