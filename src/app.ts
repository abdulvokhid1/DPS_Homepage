/** @format */

import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./router/authRoutes";
import routes from "./router/routes";
import cors from "cors";
import trackRoutes from "./router/trackRoutes";

const app = express();

// Allow requests from frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      // "https://dps-homepage-front-ex9e.vercel.app",
      "https://metaselferral.com", // ✅ if you will use this later
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is up and running");
});
app.use("/api/admin", authRoutes);
app.use("/api/user", routes);
app.use("/api", trackRoutes);

export default app;
