/** @format */

import { Router } from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  userMe,
  naverLoginRedirect,
  handleNaverCallback,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", authMiddleware, userLogout);
router.get("/me", authMiddleware, userMe);
// router.get("/verify-email", verifyEmail);

router.get("/naver", naverLoginRedirect);
router.get("/naver/callback", handleNaverCallback);

export default router;
