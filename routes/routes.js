'use strict'

const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todosController');
const aliveController = require('../controllers/aliveController');
const fitPlannerController = require('../controllers/fitPlannerController');

/** alive route, for frontend to see if backend is reachable */
//router.get('/api/alive', aliveController); 

/** todo route, to manipulate todos on the database */
router.get('/api/todos/:id?', todoController.get);
router.post('/api/todos', todoController.post);
router.put('/api/todos', todoController.put);
router.delete('/api/todos/:id', todoController.delete);
/** todo file-upload */
router.post('/api/todos/file', todoController.upload);

/** fitPlanner routes, to maniplulate the fitness plan / trainings plan */
router.get('/api/fit/:phase?/:day?', fitPlannerController.get);
router.post('/api/fit', fitPlannerController.post);
router.put('/api/fit', fitPlannerController.put);
router.delete('/api/fit/:phase/:day', fitPlannerController.delete);


module.exports = router;

