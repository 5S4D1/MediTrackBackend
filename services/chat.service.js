const OpenAI = require("openai");
const { db } = require("../config/firebase");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.askAI = async (uid, userMessage, topic = "general") => {
  // 1️⃣ Ask OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a friendly medical and diet assistant. Provide safe, simple, non-diagnostic advice."
      },
      { role: "user", content: userMessage }
    ]
  });

  const botReply = completion.choices[0].message.content;

  // 2️⃣ Save chat log to Firestore
  const ref = db
    .collection("users")
    .doc(uid)
    .collection("chatLogs")
    .doc();

  await ref.set({
    chatId: ref.id,
    userMessage,
    botReply,
    topic,
    timestamp: new Date()
  });

  return botReply;
};

exports.getChatHistory = async (uid) => {
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("chatLogs")
    .orderBy("timestamp", "desc")
    .limit(50)
    .get();

  return snapshot.docs.map((doc) => doc.data());
};
