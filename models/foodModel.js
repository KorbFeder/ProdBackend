const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');
const {promisify} = require('util');

const con = dbConnection();

//convert every query into a promise
const query = promisify(con.query).bind(con);

con.on('connection', (connection) => {
    console.log('new connection to todos is made: ' + connection.threadId);
});

module.exports = {
    getFood: function(id, userId) {
        if(id) {
            return query(`SELECT * FROM food WHERE id === ${id}`);
        } else {
            return query(`SELECT * FROM food`);
        }
    },

    updateFood: function(req, res, next) {

    },

    insertFood: function(req, res, next) {
        
    },

    deleteFood: function(req, res, next) {

    }
}