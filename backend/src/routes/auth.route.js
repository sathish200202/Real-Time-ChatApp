import express from "express";

import {
  Login,
  Logout,
  Signup,
  updateProfile,
  checkAuth,
} from "..//controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//sign up Route
router.post("/signup", Signup);

//login Route
router.post("/login", Login);

//logout Route
router.post("/logout", Logout);

//update profile Route
router.put("/update-profile", protectRoute, updateProfile);

//get user Route
router.get("/check", protectRoute, checkAuth);

export default router;
