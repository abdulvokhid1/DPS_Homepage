/** @format */

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";
import { Admin, QA } from "../models/Admin";
import { User } from "../models/Users";
import { ExchangeInquiry } from "../models/ExchangeInquiry";

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ message: "All fields are required" });

  const existing = await Admin.findOne({ email });
  if (existing)
    return res.status(409).json({ message: "Admin already exists" });

  const hashed = await bcrypt.hash(password, 12);
  const admin = new Admin({ email, password: hashed, name });
  await admin.save();

  return res.status(201).json({ message: "Admin registered" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({
    id: admin._id,
    email: admin.email,
    role: admin.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    domain: ".metaselferral.com", // <-- ADD THIS LINE
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({ message: "Logged in" });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
};

export const getMe = (req: Request, res: Response) => {
  const admin = (req as any).user;
  if (!admin || admin.role !== "admin")
    return res.status(401).json({ message: "Unauthorized" });
  return res.json(admin);
};
/// // ✅ Get all users, with optional query filters
export const getAllUsers = async (req: Request, res: Response) => {
  const { name, email } = req.query;

  let filter: any = {};
  if (name) filter.name = { $regex: new RegExp(name as string, "i") };
  if (email) filter.email = email;

  const users = await User.find(filter).select("-password");
  res.status(200).json(users);
};

// ✅ Get one user by email or name
export const getUserByQuery = async (req: Request, res: Response) => {
  const { name, email } = req.query;

  if (!name && !email) {
    return res.status(400).json({ message: "Please provide name or email" });
  }

  let filter: any = {};
  if (name) filter.name = { $regex: new RegExp(name as string, "i") };
  if (email) filter.email = email;

  const user = await User.findOne(filter).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
};

export const getExchangeUsers = async (req: Request, res: Response) => {
  const { name } = req.query;

  let filter: any = {};
  if (name) filter.name = { $regex: new RegExp(name as string, "i") };
  try {
    const users = await ExchangeInquiry.find(filter).select("-password");
    res.status(200).json(users);
  } catch (err: any) {
    console.error("❌ User Fetch Error:", err.response?.data || err.message);
    setError(err.response?.data?.message || "Failed to load users");
  }
};
function setError(arg0: any) {
  throw new Error("Function not implemented.");
}

export const updateUserNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { note } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { note }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Note updated", user });
  } catch (err) {
    console.error("Note update error:", err);
    res.status(500).json({ message: "Failed to update note" });
  }
};
export const updateExchangeUserNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { note } = req.body;

  try {
    const user = await ExchangeInquiry.findByIdAndUpdate(
      id,
      { note },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Note updated", user });
  } catch (err) {
    console.error("Note update error:", err);
    res.status(500).json({ message: "Failed to update note" });
  }
};

// Create new QA
export const createQA = async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;
    const newQA = await QA.create({
      question,
      answer,
      // createdBy: req.user.id, // from authMiddleware
    });
    res.status(201).json(newQA);
  } catch (err) {
    res.status(500).json({ message: "Failed to create Q&A" });
  }
};

// Get all QAs
export const getAllQAs = async (_req: Request, res: Response) => {
  try {
    const qas = await QA.find().sort({ createdAt: -1 });
    res.json(qas);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Q&As" });
  }
};
