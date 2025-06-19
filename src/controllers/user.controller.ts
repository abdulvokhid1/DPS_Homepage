/** @format */

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";
import { User } from "../models/Users";
// import { sendVerificationEmail } from '../utils/sendMail';
import axios from "axios";
import { requireEnv } from "../config/requireEnv";

export const userRegister = async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashed,
      name,
      phone,
    });

    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// e
export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch =
    user.password && (await bcrypt.compare(password, user.password));

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ id: user._id, email: user.email, role: user.role });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // force this!
    sameSite: "none",
    domain: ".metaselferral.com",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Logged in" });
};

import { ExchangeInquiry } from "../models/ExchangeInquiry";
import { sendTelegramMessage } from "../utils/sendTelegram";

export const submitExchangeInquiry = async (req: Request, res: Response) => {
  const { name, phone, age, callTime } = req.body;

  if (!name || !phone || !age || !callTime) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const ageNum = Number(age);
  if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
    return res.status(400).json({ message: "Invalid age" });
  }

  try {
    const inquiry = new ExchangeInquiry({
      name,
      phone,
      age: ageNum,
      callTime,
    });

    await inquiry.save();

    // ✅ Send Telegram notification
    const message = `📥 *New Exchange Inquiry*\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n🎂 Age: ${age}\n🕒 Call Time: ${callTime}`;
    await sendTelegramMessage(message);

    res.status(201).json({ message: "문의가 정상적으로 등록되었습니다!" });
  } catch (err) {
    console.error("❌ Inquiry submission error:", err);
    res.status(500).json({ message: "제출에 실패했습니다." });
  }
};

/////////

export const userLogout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const userMe = (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  res.json(user);
};

///////////////////////////////

export const naverLoginRedirect = (req: Request, res: Response) => {
  try {
    const redirectUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${requireEnv(
      "NAVER_CLIENT_ID"
    )}&redirect_uri=${encodeURIComponent(
      requireEnv("NAVER_CALLBACK_URL")
    )}&state=naverLogin`;

    console.log("🌐 Redirecting to Naver:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("❌ Naver redirect error:", err);
    res.status(500).json({ message: "Failed to redirect to Naver" });
  }
};

export const handleNaverCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  try {
    // 🔁 Exchange code for access token
    const tokenRes = await axios.get("https://nid.naver.com/oauth2.0/token", {
      params: {
        grant_type: "authorization_code",
        client_id: requireEnv("NAVER_CLIENT_ID"),
        client_secret: requireEnv("NAVER_CLIENT_SECRET"),
        code,
        state,
      },
    });

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      console.log("TOKEN RESPONSE", tokenRes.data);
      throw new Error("No access token received");
    }

    // 🧠 Get user profile
    const profileRes = await axios.get("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { email, name } = profileRes.data.response;
    console.log("✅ NAVER USER:", email, name);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        provider: "naver",
        verified: true, // ✅ Skip email verification
      });
      await user.save();
      console.log("✅NEW NAVER USER  REGISTERED:", user);
    } else {
      console.log("✅ EXISTING NAVER USER LOGGED IN:", user);
    }

    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none", // ← WAS "lax", MUST BE "none"
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.redirect("https://dps-homepage-front.vercel.app"); // ✅ redirect to frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Naver login failed" });
  }
};

/////////
export const googleLoginRedirect = (req: Request, res: Response) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${requireEnv(
    "GOOGLE_CLIENT_ID"
  )}&redirect_uri=${encodeURIComponent(
    requireEnv("GOOGLE_CALLBACK_URL")
  )}&scope=openid%20email%20profile&state=googleLogin&access_type=offline`;

  res.redirect(redirectUrl);
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: requireEnv("GOOGLE_CLIENT_ID"),
          client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
          redirect_uri: requireEnv("GOOGLE_CALLBACK_URL"),
          grant_type: "authorization_code",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 2. Get user info
    const profileRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { email, name } = profileRes.data;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        provider: "google",
        verified: true,
      });
      await user.save();
      console.log("🆕 Registered new Google user:", user);
    } else {
      console.log("🆕 Existing Google user logged in:", user);
    }

    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none", // ← WAS "lax", MUST BE "none"
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.redirect("https://dps-homepage-front.vercel.app");
  } catch (err) {
    console.error("❌ Google login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};
