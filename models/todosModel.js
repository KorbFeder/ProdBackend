'use strict'

const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');
const {promisify} = require('util');

/**
 * The todo model Object looks like this:
 * id: number
 * isDone: boolean,
 * todoMsg: string,
 * importance: int,
 * endDate: Date,
 * details: string,
 * imgUrl: string,
 */


const con = dbConnection();

//convert every query into a promise
const query = promisify(con.query).bind(con);

con.on('connection', (connection) => {
    console.log('new connection to todos is made: ' + connection.threadId);
});

module.exports = {
    /**
     * This function returns all todos from the database, if an error occurs the error will be found 
     * in the rejected error. 
     */
    getAllTodos: function(userId) {
        return query(`SELECT * FROM todos WHERE userId = ${mysql.escape(userId)}`).then((result) => {
            return isDoneHelper(result);
        });
    },

    /**
     * This method returns the specific todo with the the given ID, if an error occurs, the error will be 
     * found in the rejected error.
     * 
     * @param {number} id 
     */
    getTodo: function(id, userId) {
        return query(`SELECT * FROM todos WHERE id = ${mysql.escape(id)} AND userId = ${mysql.escape(userId)}`).then((result) => {
            return isDoneHelper(result);
        })
    },

    /**
     * This method inserts a todo object into the database, if an error occurs, the error will be found
     * in the rejected error.
     * The todo object should contain the following attributes:
     * This will return the inserted Object
     *  
     * @param {object} todo 
     */
    saveTodo: function(todo) {
        //the todo.endDate is sent as string and needs to be converted into the right format first
        if(todo.endDate !== null){
            todo.endDate = new Date(todo.endDate);       
        }
        return query(`INSERT INTO todos(id, isDone, todoMsg, importance, endDate, details, imgUrl, userId) 
                       VALUES (${mysql.escape(todo.id)}, ${mysql.escape(todo.isDone)}, 
                        ${mysql.escape(todo.todoMsg)}, ${mysql.escape(todo.importance)}, 
                        ${mysql.escape(todo.endDate)}, ${mysql.escape(todo.details)},
                        ${mysql.escape(todo.imgUrl)}, ${mysql.escape(todo.userId)})`).then((result) => {
                            return this.getTodo(result.insertId, todo.userId);
                        }).then((result) => {
                            return isDoneHelper(result);
                        });
    }, 

    /**
     * This function updates an todo, with the given todo, but only if the todo already exists in the database.
     * Than it will send the newly updated todo back.
     * 
     * @param {object} todo 
     */
    update: function(todo) {
        if(todo.endDate !== null){
            todo.endDate = new Date(todo.endDate);       
        }
        return this.getTodo(todo.id, todo.userId).then((result) => {
            if(result.length > 0){
                return query(`UPDATE todos 
                              SET isDone = ${mysql.escape(todo.isDone)}, todoMsg = ${mysql.escape(todo.todoMsg)},
                                  importance = ${mysql.escape(todo.importance)}, endDate = ${mysql.escape(todo.endDate)},
                                  details = ${mysql.escape(todo.details)}, imgUrl = ${mysql.escape(todo.imgUrl)}
                              WHERE id = ${mysql.escape(todo.id)} AND userId = ${mysql.escape(todo.userId)}`);
            }else{
                return new Promise((result, reject) => {
                    reject('the id was not found')
                });
            }
        }).then(() => {
            return this.getTodo(todo.id, todo.userId);
        }).then((result) => {
            return isDoneHelper(result);
        });
    },
    /**
     * This function deletes the todo in the database where the id is equals the id given.
     * This will return the id which was deleted.
     * 
     * @param {number} id 
     */
    deleteTodo: function(id, userId) {
        return query(`DELETE FROM todos WHERE id = ${mysql.escape(id)} AND userId = ${mysql.escape(userId)}`).then(() => {
            return new Promise((resolve, reject) => {
                resolve(id);
            })
        });
    }
}

/**
 * Helper function to convert binary data stored in database (0 or 1) into true or false.
 * 
 * @param {Array} result 
 */
function isDoneHelper(result) {
    return new Promise((resolve, reject) => {
        for(let todo of result) {
            if(todo.isDone === 0) {
                todo.isDone = false;
            }else if(todo.isDone === 1) {
                todo.isDone = true;
            }        
        }
        resolve(result);
    });
}
