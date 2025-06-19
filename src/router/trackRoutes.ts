/** @format */

import { Router } from "express";
import geoip from "geoip-lite";
import Visitor from "../models/Visitor";

const router = Router();

router.post("/track-visitor", async (req, res) => {
  const { fingerprint } = req.body;
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  if (!fingerprint)
    return res.status(400).json({ error: "Missing fingerprint" });

  const exists = await Visitor.findOne({ fingerprint });
  if (!exists) {
    const geo = geoip.lookup(ip);

    await Visitor.create({
      fingerprint,
      ip,
      country: geo?.country || null,
      region: geo?.region || null,
      city: geo?.city || null,
    });
  }

  res.sendStatus(200);
});

// ✅ Add this GET route
router.get("/visitors", async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ visitedAt: -1 }).limit(100);
    res.json(visitors);
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ message: "Failed to fetch visitors" });
  }
});

export default router;
