/** @format */

import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./router/authRoutes";
import routes from "./router/routes";
import cors from "cors";
import trackRoutes from "./router/trackRoutes";
import tradingRoutes from "./router/tradingRoutes";
const app = express();

// Allow requests from frontend

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://www.metaselferral.com",
      "https://api.metaselferral.com", // ★ REQUIRED ★
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.send("Backend is up and running");
});
app.use("/api/admin", authRoutes);
app.use("/api/user", routes);
app.use("/api/visitors", trackRoutes);
app.use("/api/trading", tradingRoutes);

export default app;
