'use strict';

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
   getSummaries: function(userId, folderId, id = null) {
        if(id === null) {
            return query(`SELECT * FROM Summaries WHERE userId = ${mysql.escape(userId)} 
                AND folderId = ${mysql.escape(folderId)}`);
        }else {
            return query(`SELECT * FROM Summaries WHERE id = ${mysql.escape(id)} 
                AND userId = ${mysql.escape(userId)} AND folderId = ${mysql.escape(folderId)}`);
        }
    },

    saveSummary: function(summaries) {
        return query(`INSERT INTO Summaries(id, userId, folderId, topic, content) 
            VALUES(${mysql.escape(summaries.id)}, ${mysql.escape(summaries.userId)}, 
                ${mysql.escape(summaries.folderId)}, ${mysql.escape(summaries.topic)},
                ${mysql.escape(summaries.content)})`).then((result) => {

                return this.getSummaries(summaries.userId, summaries.folderId, result.insertId);
            });
    },

    updateSummary: function(summaries) {
        return this.getSummaries(summaries.userId, summaries.id).then((result) => {
            if(result.length > 0) {
                return query(`UPDATE Summaries 
                            SET userId = ${mysql.escape(summaries.userId)}, 
                                folderId = ${mysql.escape(summaries.folderId)}, 
                                topic = ${mysql.escape(summaries.topic)},
                                content = ${mysql.escape(summaries.content)}
                            WHERE id = ${mysql.escape(summaries.id)} AND 
                                userId = ${mysql.escape(summaries.userId)}`);           
            } else {
                return new Promise((result, reject) => {
                    reject('the id was not found');
                });
            }
        }).then(() => {
            return this.getSummaries(summaries.userId, summaries.id);
        })
    },

    deleteSummary: function(id, userId) {
        return query(`DELETE FROM Summaries WHERE id = ${mysql.escape(id)} 
                      AND userId = ${mysql.escape(userId)}`).then(() => {
                          return new Promise((resolve, reject) => {
                              resolve(id);
                          });
                      });
    }

};