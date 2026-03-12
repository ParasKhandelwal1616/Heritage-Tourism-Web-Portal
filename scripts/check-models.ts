const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env.local") });

async function checkApi() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("❌ GEMINI_API_KEY is missing from .env.local");
    return;
  }
  
  console.log("Key first 4 chars:", apiKey.substring(0, 4));

  // Try v1 explicitly by using fetch or similar, but the SDK should handle it.
  // Let's try to see if the key is a valid Google AI Studio key.
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("✅ Success with gemini-1.5-flash");
    console.log(result.response.text());
  } catch (e) {
    console.log("❌ gemini-1.5-flash failed:", e.message);
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("✅ Success with gemini-pro");
    } catch (e2) {
        console.log("❌ gemini-pro failed:", e2.message);
    }
  }
}

checkApi();
