const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env.local") });

async function testFetch() {
  const apiKey = process.env.GEMINI_API_KEY;
  const models = ["gemini-1.5-flash", "gemini-1.0-pro"];
  
  console.log("Testing with direct fetch (v1 API)...");

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello" }] }]
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`✅ ${model} (v1): SUCCESS`);
      } else {
        console.log(`❌ ${model} (v1): FAILED (${response.status})`);
        console.log(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      console.log(`❌ ${model} (v1): ERROR (${e.message})`);
    }
  }
}

testFetch();
