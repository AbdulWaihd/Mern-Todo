const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function run() {
  console.log("Using key starting with:", process.env.GEMINI_API_KEY.substring(0, 10));
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Try Different Models including more recent ones
  const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.0-flash-exp", "gemini-1.0-pro"];
  
  for (const m of models) {
    console.log(`\n--- Testing ${m} ---`);
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("hi");
      console.log(`SUCCESS: ${m} works! Response:`, result.response.text());
      process.exit(0);
    } catch (e) {
      console.error(`${m} failed with:`, e.message);
    }
  }
}
run();
