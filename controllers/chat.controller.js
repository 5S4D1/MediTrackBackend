const chatService = require("../services/chat.service");

exports.chatWithAI = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { message, topic } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await chatService.askAI(uid, message, topic);

    res.json({
      success: true,
      reply
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI chat failed" });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const uid = req.user.uid;
    const history = await chatService.getChatHistory(uid);

    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ error: "Failed to load chat history" });
  }
};
