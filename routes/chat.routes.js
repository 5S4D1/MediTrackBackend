const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const chatController = require("../controllers/chat.controller");

// Ask AI (diet / health)
router.post("/", auth, chatController.chatWithAI);

// Get chat history
router.get("/history", auth, chatController.getChatHistory);

module.exports = router;
