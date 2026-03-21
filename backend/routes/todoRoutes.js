const express = require('express');
const router = express.Router();
const { createTodo, getTodos, deleteTodo, updateTodo, aiSortTodos, bulkCreateTodos } = require('../controller/todoController');

router.get('/', getTodos);
router.post('/', createTodo);
router.post('/ai-sort', aiSortTodos);
router.post('/bulk', bulkCreateTodos);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;

