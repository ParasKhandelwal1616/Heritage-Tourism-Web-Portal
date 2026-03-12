const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env.local") });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Checking available models for your API Key...");

  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ API Success! Available models:");
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log(`❌ API Error (${response.status}):`, data.error.message);
    }
  } catch (e) {
    console.log("❌ Network Error:", e.message);
  }
}

listModels();
