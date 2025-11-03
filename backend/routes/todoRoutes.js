const express = require('express');
const router = express.Router();
const { createTodo, getTodos, deleteTodo, updateTodo } = require('../controller/todoController');

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
