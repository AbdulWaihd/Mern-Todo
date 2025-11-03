const Todo = require('../models/todoModel');

//  Add Todo
const createTodo = async (req, res) => {
    const { title, description, priority } = req.body;
    try {
        const todo = await Todo.create({
            title,
            description,
            priority,
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

module.exports = { createTodo, getTodos, deleteTodo, updateTodo };
