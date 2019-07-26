'use strict'

const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todosController');
const aliveController = require('../controllers/aliveController');
const foodController = require('../controllers/foodController');
const fitPlannerController = require('../controllers/fitPlannerController');
const fileFolder = require('../config/constants').fileFolder;
const login = require('../auth/login');
const register = require('../auth/register');

/** alive route, for frontend to see if backend is reachable */
//router.get('/api/alive', aliveController); 

/** authentication routes */
router.post('/api/login', login);
router.post('/api/register', register);

/** todo route, to manipulate todos on the database */
router.get('/api/todos/:id?', todoController.get);
router.post('/api/todos', todoController.post);
router.put('/api/todos', todoController.put);
router.delete('/api/todos/:id', todoController.delete);
/** todo file-upload */
router.post('/api/todos/file', todoController.upload);
router.get(`/api/todos/file${fileFolder}/:file`, todoController.download);
router.delete(`/api/todos/file${fileFolder}/:file`, todoController.deleteFile);

/** fitPlanner routes, to maniplulate the fitness plan / trainings plan */
router.get('/api/fit/:phase?/:day?', fitPlannerController.get);
router.post('/api/fit', fitPlannerController.post);
router.put('/api/fit', fitPlannerController.put);
router.delete('/api/fit/:phase/:day', fitPlannerController.delete);

/** food routes */
router.get('/api/food/:id?', foodController.get);
router.post('/api/food', foodController.post);
router.put('/api/food', foodController.put);
router.delete('/api/food/:id', foodController.delete);



module.exports = router;

