const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const listModels = async () => {
      // Actually, the new SDK uses a different way to list models, or we can just try another endpoint
      // Let's try gemini-1.5-flash which is the most common one.
      // Wait, let's try gemini-1.5-flash-8b or gemini-2.0-flash-exp?
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("hello");
      console.log("Response:", result.response.text());
    };
    await listModels();
  } catch (e) {
    console.error("Full error:", e);
  }
}
run();
