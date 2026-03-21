const { GoogleGenerativeAI } = require('@google/generative-ai');

const aiBreakdown = async (req, res) => {
    try {
        const { goal, deadline, context } = req.body;

        if (!goal) {
            return res.status(400).json({ error: "Please provide a goal" });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
            return res.status(400).json({ error: 'Please set your GEMINI_API_KEY in the backend .env file to use this AI feature.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const today = new Date().toISOString().split('T')[0];

        const prompt = `You are a productivity assistant. The user will give you a goal and a deadline. Break it down into 4 to 7 specific, actionable subtasks.

Return ONLY a valid JSON object with no markdown, no explanation, no code blocks, no additional text. Just raw JSON. Follow this exact schema:

{
  "goal": "the goal text",
  "subtasks": [
    {
      "title": "specific actionable task title",
      "description": "brief description of what to do",
      "priority": "high" or "medium" or "low",
      "estimatedTime": "time estimate like 45 mins or 2 hours",
      "suggestedDeadline": "YYYY-MM-DD"
    }
  ]
}

Rules:
- Generate 4-7 subtasks
- Distribute deadlines evenly between today (${today}) and the user's provided deadline (${deadline || 'one week from now'})
- Assign priority (high/medium/low) based on importance and logical sequence of tasks
- Return ONLY JSON.

User's Goal: "${goal}"
Deadline: ${deadline || 'one week from now'}
${context ? `Additional Context: ${context}` : ''}`;

        const result = await model.generateContent(prompt);
        let rawResponse = result.response.text().trim();

        // Strip code blocks if Gemini wraps it
        if (rawResponse.startsWith('```json')) {
            rawResponse = rawResponse.substring(7, rawResponse.length - 3).trim();
        } else if (rawResponse.startsWith('```')) {
            rawResponse = rawResponse.substring(3, rawResponse.length - 3).trim();
        }

        const aiResponse = JSON.parse(rawResponse);

        // Validate structure
        if (!aiResponse.subtasks || !Array.isArray(aiResponse.subtasks)) {
            return res.status(500).json({ error: "AI returned an invalid response. Please try again." });
        }

        res.status(200).json(aiResponse);

    } catch (err) {
        console.error("AI Breakdown error:", err);
        if (err.message.includes("JSON")) {
            return res.status(500).json({ error: "AI returned malformed data. Please try again." });
        }
        res.status(500).json({ error: "Failed to break down goal: " + err.message });
    }
};

module.exports = { aiBreakdown };
