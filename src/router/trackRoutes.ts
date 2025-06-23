/** @format */

import express from "express";
import Visitor from "../models/Visitor";
import geoip from "geoip-lite";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly";
import { UAParser } from "ua-parser-js";

const router = express.Router();

// Track visitor
router.post("/track", async (req, res) => {
  try {
    const fingerprint = req.body.fingerprint;
    if (!fingerprint) {
      return res.status(400).json({ message: "Missing fingerprint" });
    }

    const existing = await Visitor.findOne({ fingerprint });
    if (existing) {
      return res.status(200).json({ message: "Already tracked" });
    }

    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    const geo = geoip.lookup(ip);
    const parser = new UAParser(req.headers["user-agent"]);
    const ua = parser.getResult();

    await Visitor.create({
      fingerprint,
      ip,
      userAgent: req.headers["user-agent"],
      country: geo?.country,
      region: geo?.region,
      city: geo?.city,
      device: ua.device?.type || "desktop",
      browser: ua.browser.name || "unknown",
      os: ua.os.name || "unknown",
    });

    res.status(201).json({ message: "Visitor tracked" });
  } catch (err) {
    console.error("❌ Failed to track visitor:", err);
    res.status(500).json({ message: "Failed to track visitor" });
  }
});

// Admin view
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ visitedAt: -1 });
    res.json(visitors);
  } catch (err) {
    console.error("❌ Failed to fetch visitors:", err);
    res.status(500).json({ message: "Error fetching visitors" });
  }
});

export default router;
