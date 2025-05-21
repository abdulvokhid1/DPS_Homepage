/** @format */

import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     name: { type: String, required: true },
//     phone: { type: String, required: true },
//     role: { type: String, default: "user" },
//     provider: { type: String, default: "local" },

//     // ✅ Email verification fields
//     verified: { type: Boolean, default: false },
//     verifyToken: { type: String },
//     verifyTokenExpiry: { type: Date },
//   },
//   { timestamps: true }
// );

// If provider === 'naver', password and phone are not required
// If provider === 'local', they’re still required

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
    birthday: {
      type: String,
      required: function (this: any) {
        return this.provider === "local";
      },
      match: /^\d{4}-\d{2}-\d{2}$/, // Regex to enforce format
    },
    bank: {
      type: String,
      required: function (this: any) {
        return this.provider === "local";
      },
    },
    account: {
      type: String,
      required: function (this: any) {
        return this.provider === "local";
      },
    },
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
