const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There is no listModels in the new SDK easily accessible the same way, but let's try calling another model:
    // Some people use gemini-1.5-pro or gemini-pro.
    
    const m = "gemini-1.5-flash"; 
    const model = genAI.getGenerativeModel({ model: m });
    const result = await model.generateContent("hello");
    console.log("Success with gemini-1.5-flash:", result.response.text());
  } catch (e) {
    console.error("Error with gemini-1.5-flash:", e.message);
  }
}
run();
