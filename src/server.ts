/** @format */

import app from "./app";
import { connectDB } from "./config/db";
import { requireEnv } from "./config/requireEnv";

const PORT = process.env.PORT || 2000;

requireEnv("NAVER_CLIENT_ID");
requireEnv("NAVER_CLIENT_SECRET");
requireEnv("NAVER_CALLBACK_URL");

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
