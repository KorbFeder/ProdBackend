const todoModel = require('../models/todosModel');

module.exports = {
    get: function(req, res, next) {
        //save id request somewhere
        id = req.id;
        if(!id) {
            todoModel.getAllTodos().then((result) => {
                console.log(`result: ${result}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`an error has occoured: ${error}`);
                res.status(405).send(error);
            })
        }else{
            todoModel.getTodo(id).then((result) => {
                console.log(`result: ${result}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`an error has occoured: ${error}`);
                res.status(405).send(error);
            })
        }
    }
}