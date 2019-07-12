'use strict'

const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todosController');
const aliveController = require('../controllers/aliveController');

router.get('/api/alive', aliveController); 

router.get('/api/todos/:id?', todoController.get);
router.post('/api/todos', todoController.post);
router.delete('/api/todos/:id', todoController.delete);

module.exports = router;

