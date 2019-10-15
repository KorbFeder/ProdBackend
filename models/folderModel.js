'use strict';

const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');
const {promisify} = require('util');

const con = dbConnection();

//convert every query into a promise
const query = promisify(con.query).bind(con);
const summariesController = require('../controllers/summariesController');

con.on('connection', (connection) => {
    console.log('new connection to todos is made: ' + connection.threadId);
});

module.exports = {
   getFolder: function(userId, id = null) {
        if(id === null) {
            return query(`SELECT * FROM Folders WHERE userId = ${mysql.escape(userId)}`);
        }else {
            return query(`SELECT * FROM Folders WHERE id = ${mysql.escape(id)} AND userId = ${mysql.escape(userId)}`);
        }
    },

    saveFolder: function(folder) {
        return query(`INSERT INTO Folders(id, userId, name) 
            VALUES(${mysql.escape(folder.id)}, ${mysql.escape(folder.userId)}, ${mysql.escape(folder.name)})`).then((result) => {
                return this.getFolder(folder.userId, folder.id);
            });
    },

    updateFolder: function(folder) {
        return this.getFolder(folder.userId, folder.id).then((result) => {
            if(result.length > 0) {
                return query(`UPDATE Folder
                              SET name = ${mysql.escape(folder.name)} 
                              WHERE ${mysql.escape(folder.id)} = id AND ${mysql.escape(folder.userId)} = userId`);
            } else {
                return new Promise((result, reject) => {
                    reject('the id was not found');
                });
            }
        }).then(() => {
            return this.getFolder(folder.userId, folder.id);
        });
    },

    deleteFolder: function(userId, id) {
        return query(`DELETE FROM Summaries 
                      WHERE folderId = ${mysql.escape(id)} 
                        AND userId = ${mysql.escape(userId)}`).then((result) => {
                            return query(`DELETE FROM Folder 
                                          WHERE id = ${mysql.escape(id)} AND userId = ${mysql.escape(userId)}`);
                        }).then((result) => {
                            return new Promise((resolve, reject) => {
                                resolve(id);
                            });
                        });
    }

};