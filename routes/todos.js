const express = require('express');
const router = express.Router();
const dbConnection = require('../config/dbConnection');

const con = dbConnection();

con.on('connection', (connection) => {
    console.log('new connection is made: ' + connection.threadId);
})

router.get('/', (req, res, next) => {
    con.query('SELECT * FROM todos', (error, result, fields) => {
        if(error){
            console.log('an error has occoured: ' + error);
            res.status(500).send(error);
        }else{
            console.log('solution: ' + result)
            res.status(200).send(result);
        }
    });
});

module.exports = router;

