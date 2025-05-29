/** @format */

import { Router } from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  userMe,
  naverLoginRedirect,
  handleNaverCallback,
  handleGoogleCallback,
  googleLoginRedirect,
  submitExchangeInquiry,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/exchange-inquiry", submitExchangeInquiry);
router.post("/logout", authMiddleware, userLogout);
router.get("/me", authMiddleware, userMe);
// router.get("/verify-email", verifyEmail);

router.get("/naver", naverLoginRedirect);
router.get("/naver/callback", handleNaverCallback);

router.get("/google", googleLoginRedirect);
router.get("/google/callback", handleGoogleCallback);

// router.get("/kakao", kakaoLoginRedirect);
// router.get("/kakao/callback", handleKakaoCallback);

export default router;
