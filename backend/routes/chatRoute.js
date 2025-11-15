import express from "express";
import { getChats, sendMessage, createChat, markMessagesAsRead } from "../controllers/chatController.js";
import {authenticateToken} from "../config/middlewares.js";

const chatRouter = express.Router();

chatRouter.get("/", authenticateToken, getChats);
chatRouter.post("/send", authenticateToken, sendMessage);
chatRouter.post("/create", authenticateToken, createChat);
chatRouter.post("/mark-read", authenticateToken, markMessagesAsRead);

export default chatRouter;