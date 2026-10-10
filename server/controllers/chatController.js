import ChatMessage from "../models/ChatMessage.js";
import asyncHandler from "../utils/asyncHandler.js";
import { reply } from "../services/aiService.js";

export const history = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    items: await ChatMessage.find({
      userId: req.user.id,
    })
      .sort("createdAt")
      .limit(100),
  });
});

export const chat = asyncHandler(async (req, res) => {
  const message = String(req.body.message || "").trim();

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  const userId = req.user.id;

  // Save user's message
  await ChatMessage.create({
    userId,
    role: "user",
    message,
  });

  // Get AI response
  const response = await reply(userId, message);

  // Save AI response
  const assistant = await ChatMessage.create({
    userId,
    role: "assistant",
    message: response,
  });

  res.json({
    success: true,
    item: assistant,
  });
});

export const clear = asyncHandler(async (req, res) => {
  await ChatMessage.deleteMany({
    userId: req.user.id,
  });

  res.json({
    success: true,
    message: "Conversation cleared",
  });
});