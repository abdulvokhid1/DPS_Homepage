/** @format */

import { Router, Request, Response } from "express";
import {
  tradingService,
  TradingMatchedUser,
} from "../services/trading.service";

const router = Router();

interface RawOrder {
  infoCode?: number | string | null;
  accountNumber?: string | number | null;
  lots?: number | string | null;
  AckInfo?: number | string | null;
  [key: string]: any;
}

// -------------------------------
// POST /api/trading/order
// -------------------------------
router.post("/order", async (req: Request, res: Response) => {
  let raw: RawOrder = {};

  try {
    const body = req.body;

    if (typeof body === "object" && body !== null) {
      const keys = Object.keys(body);

      // Handle case like: { "{...json}": "" }
      if (keys.length === 1 && keys[0].startsWith("{")) {
        const key = keys[0].replace(/\x00/g, "").trim();
        raw = JSON.parse(key);
      } else {
        raw = body;
      }
    }
  } catch (err) {
    console.error("❌ Parsing error:", err);
    raw = {};
  }

  // Normalize values
  const normalized: RawOrder = {
    ...raw,
    infoCode: raw.infoCode ?? null,
    accountNumber:
      raw.accountNumber != null
        ? String(raw.accountNumber)
        : raw.lots != null
        ? String(raw.lots)
        : null,
  };

  const matchedUser = await tradingService.addOrder(normalized);

  let AckInfo = 0;
  let infoCode = 2828; // default → NOT_FOUND

  if (matchedUser) {
    infoCode = 1818;

    if (matchedUser.accessExpiresAt) {
      const now = new Date();
      const expiry = new Date(matchedUser.accessExpiresAt);
      if (expiry > now) AckInfo = 1;
    }
  }

  return res.json({
    success: true,
    message: matchedUser ? "레오 받았습니다" : "사용자를 찾을 수 없습니다",
    infoCode,
    accountNumber: normalized.accountNumber,
    status: matchedUser ? "OK" : "NOT_FOUND",
    serverTime: new Date().toISOString(),
    AckInfo,
    user: matchedUser ?? null,
  });
});

// -------------------------------
// GET /api/trading/orders
// -------------------------------
router.get("/orders", (_req: Request, res: Response) => {
  res.json(tradingService.getOrders());
});

// -------------------------------
// GET /api/trading/data
// -------------------------------
router.get("/data", (_req: Request, res: Response) => {
  const { tradingData, totalLoss } = tradingService.getTradingData();

  res.json({
    success: true,
    data: tradingData,
    total_loss: totalLoss,
    count: tradingData.length,
  });
});

// -------------------------------
// GET /api/trading/dashboard
// -------------------------------
router.get("/dashboard", (_req: Request, res: Response) => {
  res.type("html").send(`
    <h1>Trading Dashboard</h1>
    <p>Use <code>/api/trading/data</code> for JSON API</p>
  `);
});

export default router;
