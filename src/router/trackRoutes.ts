/** @format */

// in a new file like src/router/trackRoutes.ts
// import { Router } from "express";
// import Visitor from "../models/Visitor";
// const router = Router();

// router.post("/track-visitor", async (req, res) => {
//   const { visitorId } = req.body;
//   if (!visitorId) return res.status(400).json({ message: "Missing visitorId" });

//   const exists = await Visitor.findOne({ visitorId });
//   if (!exists) {
//     await Visitor.create({ visitorId });
//   }

//   res.sendStatus(200);
// });

// export default router;
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

export default router;
