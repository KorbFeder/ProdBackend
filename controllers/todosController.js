'use strict'

const todoModel = require('../models/todosModel');

module.exports = {
    get: function(req, res, next) {
        //save id request somewhere
        const id = req.params.id;
        if(!id) {
            todoModel.getAllTodos().then((result) => {
                console.log(`result: ${result}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`an error has occoured: ${error}`);
                res.status(405).send(error);
            });
        }else{
            todoModel.getTodo(id).then((result) => {
                console.log(`result: ${result}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`an error has occoured: ${error}`);
                res.status(405).send(error);
            });
        }
    },
    post: function(req, res, next) {
        const todo = req.body;
        if(todo) {
            todoModel.saveTodo(todo).then((result) => {
                console.log(`result: ${result}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`an error has occoured ${error}`);
                res.status(405).send(error);
            });
        }else{
            console.log("request body was empty");
            res.status(400).send("request body was empty")
        }
    },
    delete: function(req, res, next) {
        console.log(req.params);
        console.log(req.query);
        const id = req.params.id;
        if(id) {
            todoModel.deleteTodo(id).then((result) => {
                console.log(`result ${result}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`an error has occoured ${error}`);
                res.status(405).send(error);
            });
        }else{
            console.log("id param was not set");
            res.status(400).send("request param was not set");
        }
    }
}