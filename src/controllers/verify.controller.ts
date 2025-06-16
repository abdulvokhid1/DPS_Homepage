/** @format */

import { Request, Response } from "express";
import { User } from "../models/Users";
import nodemailer from "nodemailer";

export const sendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await User.updateOne(
    { email },
    { email, verifyCode: code, verifyCodeExpiry: expiry },
    { upsert: true }
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your verification code",
    html: `<h3>Your code is: <b>${code}</b></h3><p>Expires in 10 minutes.</p>`,
  });

  return res.json({ message: "Verification code sent" });
};

export const verifyEmailCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.verifyCode || !user.verifyCodeExpiry) {
    return res
      .status(400)
      .json({ message: "No code found. Please request again." });
  }

  if (user.verifyCode !== code || user.verifyCodeExpiry < new Date()) {
    return res.status(401).json({ message: "Invalid or expired code" });
  }

  user.verified = true;
  user.verifyCode = undefined;
  user.verifyCodeExpiry = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
};
