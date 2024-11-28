import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessages,
} from "../controllers/message.contoller.js";

const router = express.Router();

//get the users Route
router.get("/users", protectRoute, getUsersForSidebar);

//get messages Route
router.get("/:id", protectRoute, getMessages);

//send messages Route
router.post("/send/:id", protectRoute, sendMessages);

export default router;
