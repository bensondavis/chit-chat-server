import express from "express";
import { deleteMessage, getMessages, sendMessage } from "../controller/chat";
const router = express.Router();

router.post("/send/:userId", sendMessage);

router.delete("/message/:id", deleteMessage);

router.get("/:userId", getMessages);

export default router;
