'use strict'

const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');

const con = dbConnection();

con.on('conneciton', (connection) => {
    console.log('new conneciton to fitPlanner is made: ' + connection.threadId);
});

module.exports = {
    /**
     * This function gets all the Trainings plans of the Database and returns them in the resolve object of
     * the Promise, if it failes it will return the error log in the reject object of the recjetion
     */
    getAllTraingsPlans: function() {
        return new Promise((resolve, reject) => {
            con.query('SELECT * FROM traningsPlan', (error, result, fields) => {
                if(error) {
                    console.log(`an error has occoured: ${error}`);
                    reject(error);
                }else{
                    console.log(`result: ${result}`);
                    console.log(`fields: ${fields}`);
                    resolve(result);
                }
            });
        });
    },

    /**
     * This function gets the Trainings plans with the givne phase  and day of the Database and 
     * returns them in the resolve object of the Promise, if it failes it will return the error 
     * log in the reject object of the recjetion
     * 
     * @param {number} phase
     * @param {number} day
     */
    getTraingsPlan: function(phase, day) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT * FROM traingsPlan WHERE phase = ${mysql.escape(phase)} AND day = ${mysql.escape(day)}`,
            (error, result, fields) => {
                if(error) {
                    console.log(`result: ${result}`);
                    reject(error);
                }else{
                    console.log(`result: ${result}`);
                    console.log(`fields: ${fields}`);
                    resolve(result);
                }
            })
        });
    }
}