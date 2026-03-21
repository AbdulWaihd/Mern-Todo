const Todo = require('../models/todoModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');

//  Add Todo
const createTodo = async (req, res) => {
    const { title, description, priority ,dueDate} = req.body;
    try {
        const todo = await Todo.create({
            title,
            description,
            priority,
            dueDate,
            userId: req.user._id // attach user from token
        });

        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//  Get All Todos
const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Todo
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Todo
const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// AI Sort Todos
const aiSortTodos = async (req, res) => {
    try {
        const { todos } = req.body;
        if (!todos || todos.length === 0) return res.status(200).json([]);
        
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
             return res.status(400).json({ error: 'Please set your GEMINI_API_KEY in the backend .env file to use this AI feature.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an AI task assistant. I will provide you a list of JSON tasks.
        Order them strictly by decreasing priority (highest priority first) based on their attributes like priority, due date, and title.
        For each task, formulate a short, concise, and motivational 'aiReason' explaining why this task is placed at this spot.
        Return ONLY a JSON array, nothing else, with exactly the following structure:
        [
            { "_id": "task_id_here", "aiReason": "Your concise reason." }
        ]
        
        Here are the tasks:
        ${JSON.stringify(todos)}
        `;

        const result = await model.generateContent(prompt);
        let rawResponse = result.response.text().trim();
        if (rawResponse.startsWith('\`\`\`json')) {
            rawResponse = rawResponse.substring(7, rawResponse.length - 3).trim();
        } else if (rawResponse.startsWith('\`\`\`')) {
            rawResponse = rawResponse.substring(3, rawResponse.length - 3).trim();
        }

        const aiResponse = JSON.parse(rawResponse);
        
        const sortedTodos = aiResponse.map(aiItem => {
            const originalTodo = todos.find(t => t._id === aiItem._id);
            if (originalTodo) {
                return { ...originalTodo, aiReason: aiItem.aiReason };
            }
            return null;
        }).filter(item => item !== null);

        const processedIds = new Set(sortedTodos.map(t => t._id));
        const missedTodos = todos.filter(t => !processedIds.has(t._id));

        res.status(200).json([...sortedTodos, ...missedTodos]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process AI sorting: ' + err.message });
    }
}

module.exports = { createTodo, getTodos, deleteTodo, updateTodo, aiSortTodos };
