'use strict'

const todoModel = require('../models/todosModel');

module.exports = {
    /**
     * This function gets the data from the model and sends it back to the frontend
     * if an id is passed with the request as param, than it will return only 1 todo, if not
     * it will return all todos in the response.
     * for example if the Id would be '1':
     * /api/todos/1
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    get: function(req, res, next) {
        const id = req.params.id;
        if(!id) {
            todoModel.getAllTodos().then((result) => {
                console.log(`getting all todos was successful: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`getting all todos had an error: ${JSON.stringify(error)}`);
                res.status(405).send(error);
            });
        }else{
            todoModel.getTodo(id).then((result) => {
                console.log(`getting one todo was successful: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`getting one todo had an error: ${JSON.stringify(error)}`);
                res.status(405).send(error);
            });
        }
    },
    /**
     * This function saves the todo to the database, it needs the data sent over the request body.
     * If it succeeds it sends back an the todo object, if not it will reject it with an error.
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    post: function(req, res, next) {
        const todo = req.body;
        if(todo) {
            todoModel.saveTodo(todo).then((result) => {
                console.log(`saving a todo was successful: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`saving a todo had an error: ${JSON.stringify(error)}`);
                res.status(405).send(error);
            });
        }else{
            console.log('request body was empty');
            res.status(400).send('request body was empty');
        }
    },
    put: function(req, res, next) {
        const todo = req.body;
        if(todo) {
            todoModel.update(todo).then((result) => {
                console.log(`updating the todo was a success: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`an error has happend: ${JSON.stringify(error)}`);
                res.status(200).send(error);
            });
        }else{
            console.log('request body was empty');
            res.status(400).send('request body was empty');
        }
    },
    /**
     * This function deletes an object from the database and sends an response depending
     * on if it succeeded. It needs an Id sent over the request params 
     * for example to delete the todo with the id '1': 
     * /api/todos/1
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    delete: function(req, res, next) {
        const id = req.params.id;
        if(id) {
            todoModel.deleteTodo(id).then((result) => {
                console.log(`deleting a todo was successful: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`deleting a todo had an error: ${JSON.stringify(error)}`);
                res.status(405).send(error);
            });
        }else{
            console.log("id param was not set");
            res.status(400).send("request param was not set");
        }
    }
}