const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');

const con = dbConnection();

con.on('connection', (connection) => {
    console.log('new connection is made: ' + connection.threadId);
})

module.exports = {
    getAllTodos: function() {
        return new Promise((resolve, reject) => {
            con.query('SELECT * FROM todos', (error, result, fields) => {
                if(error){
                    reject(error);
                }else{
                    resolve(result);
                }
            });
        });
    },

    getTodo: function(id) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT * FROM todos WHERE id = ${mysql.escape(id)}`, (error, result, fields) => {
                if(error) {
                    reject(error);
                }else{
                    resolve(result);
                }
            });
        });
    },

    saveTodos: function() {

    }
}