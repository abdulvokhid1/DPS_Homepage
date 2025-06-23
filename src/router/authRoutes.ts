/** @format */

import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly";
import {
  createQA,
  deleteQA,
  getAllQAs,
  getAllUsers,
  getExchangeUsers,
  getUserByQuery,
  updateExchangeUserNote,
  updateQA,
  updateUserNote,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

//Authenticated Admin routes
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/me", authMiddleware, AuthController.getMe);

// Admin-only routes
router.get("/users", authMiddleware, adminOnly, getAllUsers);
router.get("/user", authMiddleware, adminOnly, getUserByQuery);
router.get("/exchangeUsers", authMiddleware, adminOnly, getExchangeUsers);
router.patch("/users/:id/note", authMiddleware, adminOnly, updateUserNote);
router.patch(
  "/exchangeUsers/:id/note",
  authMiddleware,
  adminOnly,
  updateExchangeUserNote
);

router.post("/qa", authMiddleware, adminOnly, createQA);
router.get("/qa", getAllQAs); // public access to view Q&As
router.put("/qa/:id", authMiddleware, adminOnly, updateQA);
router.delete("/qa/:id", authMiddleware, adminOnly, deleteQA);
export default router;
