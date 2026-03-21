const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function run() {
    // Specify v1 explicitly
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Using v1 endpoint manually (via raw fetch to test)...");

    const m = "gemini-1.5-flash";
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/${m}:generateContent?key=${key}`;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
        });
        const data = await res.json();
        console.log("Result from /v1/ models:", JSON.stringify(data));
    } catch (e) {
        console.error("Fetch error:", e.message);
    }
}
run();
