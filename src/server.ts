/** @format */

import dotenv from "dotenv";

// 1) NODE_ENV에 따라 다른 env 파일 로드
const nodeEnv = process.env.NODE_ENV || "development";

dotenv.config({
  path: nodeEnv === "production" ? ".env.prod" : ".env.dev",
});

import app from "./app";
import { connectDB } from "./config/db";
import { requireEnv } from "./config/requireEnv";

// 2) 포트 설정 (env에서 못 읽으면 2000으로 fallback)
const PORT = process.env.PORT || 2000;

// 3) 필수 환경변수 체크
["NAVER_CLIENT_ID", "NAVER_CLIENT_SECRET", "NAVER_CALLBACK_URL"].forEach(
  (key) => requireEnv(key)
);

// 4) DB 연결 후 서버 시작
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT} in ${nodeEnv} mode`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
    process.exit(1);
  });
