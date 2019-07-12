const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todosController');
const aliveController = require('../controllers/aliveController');

router.get('/api/alive', aliveController); 
router.get('/api/todos', todoController.get);

module.exports = router;

