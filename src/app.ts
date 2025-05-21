/** @format */

import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./router/authRoutes";
import routes from "./router/routes";
import cors from "cors";

const app = express();

// Allow requests from frontend
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend domain
    credentials: true, // important for cookies
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is up and running");
});
app.use("/api/admin", authRoutes);
app.use("/api/user", routes);

export default app;
