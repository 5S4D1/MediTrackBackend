const OpenAI = require("openai");
const { db } = require("../config/firebase");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ Health-related keywords to validate questions
const HEALTH_KEYWORDS = [
  // Medical
  "disease", "illness", "symptom", "treatment", "medicine", "doctor", "hospital", "health",
  "medical", "patient", "diagnosis", "condition", "pain", "fever", "cold", "flu", "allergy",
  "infection", "injury", "wound", "blood", "heart", "lung", "brain", "kidney", "liver",
  
  // Diet & Nutrition
  "diet", "nutrition", "food", "eat", "eating", "calorie", "protein", "carb", "fat", 
  "vitamin", "mineral", "supplement", "recipe", "meal", "breakfast", "lunch", "dinner",
  "weight", "calories", "sugar", "salt", "healthy", "fiber", "cholesterol",
  
  // Lifestyle & Fitness
  "exercise", "workout", "fitness", "gym", "run", "walk", "yoga", "sleep", "rest",
  "stress", "anxiety", "mental health", "depression", "wellness", "lifestyle", "habit",
  "water intake", "hydration",
  
  // General Health Topics
  "pregnancy", "pregnancy", "vaccination", "vaccine", "immunization", "skin", "hair",
  "digestion", "metabolism", "energy", "fatigue", "immune", "aging", "sexual health",
  "menopause", "period", "puberty"
];

// ✅ Function to check if question is health-related
const isHealthRelated = (userMessage) => {
  const messageLower = userMessage.toLowerCase();
  
  // Check if message contains any health-related keywords
  const isRelevant = HEALTH_KEYWORDS.some(keyword => 
    messageLower.includes(keyword)
  );
  
  return isRelevant;
};

exports.askAI = async (uid, userMessage, topic = "general") => {
  // 0️⃣ Validate if question is health-related
  if (!isHealthRelated(userMessage)) {
    const rejectionMessage = 
      "I can only help with health, medical, diet, and lifestyle questions. " +
      "Please ask me something related to medical, nutrition, fitness, or wellness! ❤️";
    
    return {
      botReply: rejectionMessage,
      isRejected: true
    };
  }

  // 1️⃣ Ask OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a friendly medical and diet assistant. Provide safe, simple, non-diagnostic advice. Only answer health, medical, diet, and lifestyle related questions."
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

  return {
    botReply,
    isRejected: false
  };
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
