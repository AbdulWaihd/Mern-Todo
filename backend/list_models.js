require('dotenv').config();

async function run() {
  const key = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
      console.log("AVAILABLE MODELS:", data.models.map(m => m.name.replace("models/", "")));
    } else {
      console.log("ERROR LISTING:", JSON.stringify(data));
    }
  } catch (e) {
    console.error("Fetch error:", e.message);
  }
}
run();
