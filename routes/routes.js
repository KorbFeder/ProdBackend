'use strict'

const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todosController');
const dailyNutrController = require('../controllers/dailyNutrController');
const fitPlannerController = require('../controllers/fitPlannerController');
const fileFolder = require('../config/constants').fileFolder;
const login = require('../auth/login');
const register = require('../auth/register');
const authMiddleware = require('../middlewares/authMiddleware')();
const nutrientController = require('../controllers/nutrientDatabaseController');
const ownFoodController = require('../controllers/ownFoodController');

/** authentication routes */
router.post('/api/login', login);
router.post('/api/register', register);

/** todo route, to manipulate todos on the database */
router.get('/api/todos/:id?', authMiddleware, todoController.get);
router.post('/api/todos', authMiddleware, todoController.post);
router.put('/api/todos', authMiddleware, todoController.put);
router.delete('/api/todos/:id', authMiddleware, todoController.delete);
/** todo file-upload */
router.post('/api/todos/file', authMiddleware, todoController.upload);
router.get(`/api/todos/file${fileFolder}/:file`, authMiddleware, todoController.download);
router.delete(`/api/todos/file${fileFolder}/:file`, authMiddleware, todoController.deleteFile);

/** fitPlanner routes, to maniplulate the fitness plan / trainings plan */
router.get('/api/fit/:phase?/:day?', authMiddleware, fitPlannerController.get);
router.post('/api/fit', authMiddleware, fitPlannerController.post);
router.put('/api/fit', authMiddleware, fitPlannerController.put);
router.delete('/api/fit/:phase/:day', authMiddleware, fitPlannerController.delete);

router.get('/api/ownfood/:id?', authMiddleware, ownFoodController.get);
router.post('/api/ownfood', authMiddleware, ownFoodController.post);
router.put('/api/ownfood', authMiddleware, ownFoodController.put);
router.delete('/api/ownfood/:id', authMiddleware, ownFoodController.delete);

/** food routes */
router.get('/api/daily/:date', authMiddleware, dailyNutrController.get);
router.post('/api/daily', authMiddleware, dailyNutrController.post);
router.put('/api/daily', authMiddleware, dailyNutrController.put);
router.delete('/api/daily/:date', authMiddleware, dailyNutrController.delete);

/** nutrient database route */
router.get('/api/nutr/food/:name/:manufac?', authMiddleware, nutrientController.get);
router.get('/api/nutr/nutr/:NDB_No', authMiddleware, nutrientController.getNutr);


module.exports = router;

