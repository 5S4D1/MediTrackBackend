require("dotenv").config();
const { admin } = require("./config/firebase");

const uid = "GKNx7yoSKTQh03VWC5S39brb6ek1";

async function getTestIdToken() {
  try {
    console.log("\n🔄 Generating custom token for UID:", uid);
    
    // Step 1: Generate custom token
    const customToken = await admin.auth().createCustomToken(uid);
    console.log("✅ Custom token created");
    
    // Step 2: Exchange for ID token
    const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "YOUR_FIREBASE_WEB_API_KEY";
    
    if (FIREBASE_API_KEY === "YOUR_FIREBASE_WEB_API_KEY") {
      console.log("\n⚠️  Firebase Web API Key not found in .env file");
      console.log("Please add FIREBASE_API_KEY to your .env file");
      console.log("\n📋 Manual exchange URL:");
      console.log(`POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=YOUR_API_KEY`);
      console.log(`\nBody:`);
      console.log(JSON.stringify({ token: customToken, returnSecureToken: true }, null, 2));
      return;
    }
    
    console.log("🔄 Exchanging for ID token...");
    
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: customToken,
          returnSecureToken: true
        })
      }
    );
    
    const data = await response.json();
    const idToken = data.idToken;
    
    console.log("\n" + "=".repeat(80));
    console.log("✅ ID TOKEN FOR TESTING");
    console.log("=".repeat(80));
    console.log("\n" + idToken + "\n");
    console.log("=".repeat(80));
    console.log("\n📝 HOW TO USE IN THUNDER CLIENT:\n");
    console.log("1. Method: GET");
    console.log("2. URL: https://meditrackbackend.onrender.com/user/check");
    console.log("3. Go to 'Headers' tab");
    console.log("4. Add header:");
    console.log("   Key: Authorization");
    console.log("   Value: Bearer " + idToken);
    console.log("\n" + "=".repeat(80));
    console.log("\n⏰ Note: ID tokens expire after 1 hour. Run this script again if needed.");
    console.log("\n");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\n💡 TIP: Make sure FIREBASE_API_KEY is set in your .env file");
    console.log("You can find it in Firebase Console → Project Settings → Web API Key");
  }
}

getTestIdToken();
