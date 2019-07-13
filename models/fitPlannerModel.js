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
     * the Promise, if it failes it will return the error log in the reject object of the recjetion.
     */
    getAllTrainingsPlans: function() {
        return new Promise((resolve, reject) => {
            con.query('SELECT * FROM traningsPlanRows', (error, result, fields) => {
                if(error) {
                    console.log(`an error has occoured: ${JSON.stringify(error)}`);
                    reject(error);
                }else{
                    console.log(`result: ${JSON.stringify(result)}`);
                    console.log(`fields: ${JSON.stringify(fields)}`);
                    resolve(result);
                }
            });
        });
    },

    /**
     * This function gets the Trainings plans with the givne phase  and day of the Database and 
     * returns them in the resolve object of the Promise, if it failes it will return the error 
     * log in the reject object of the recjetion.
     * 
     * @param {number} phase
     * @param {number} day
     */
    getTrainingsPlan: function(phase, day) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT * 
                       FROM trainingsPlanRows
                       WHERE phase = ${mysql.escape(phase)} AND dayNr = ${mysql.escape(day)}`,
            (error, result, fields) => {
                if(error) {
                    console.log(`error in first query: ${JSON.stringify(error)}`);
                    reject(error);
                }else{
                    console.log(`get TrainingsPlan first select query result: ${JSON.stringify(result)}`);
                    console.log(`get TrainingsPlan first select query fields: ${JSON.stringify(fields)}`);
//                    con.query(`SELECT w.*
//                               FROM weights w, trainingsPlanRows t
//                               WHERE w.id = ${result}`)
                }
            })
        });
    },

    /**
     * This function inserts a trainingsplan into the trainingsPlanRows table and also adds the reapitionsDone
     * and weightsUsed in their respective table. This is needed since both the last 2 are arrays and are needed
     * to be saved extra since they can be of dynamic size.
     * It returns an array of Promises containing the Ids of the rows inserted into the table.
     *  
     * @param {object} trainigsPlan 
     */
    saveTrainingsPlan: function(trainingsplan) {
        const promises = [];
        for(const trainingsplanRow of trainingsplan) {
            promises.push(saveTrainingsPlanHelper(trainingsplanRow));
        }
        return promises;
    } 
}


function saveTrainingsPlanHelper(trainigsPlan) {
    return new Promise((resolve, reject) => {
        console.log('start');
        if(!trainigsPlan) {
            console.log('no trainingsplan was passed into the function');
            reject('no trainigsplan was passed into the function');
        } else {
            //inserts into the trainingsplan table the basic trainingsplan
            con.query(`INSERT INTO trainingsPlanRows(phase, dayNr, muscle, excercise, amountOfSets, repeatitions, pauseInbetween, startingWeight)
                        VALUES(${mysql.escape(trainigsPlan.phase)}, ${mysql.escape(trainigsPlan.dayNr)}, 
                        ${mysql.escape(trainigsPlan.muscle)}, ${mysql.escape(trainigsPlan.excercise)}, 
                        ${mysql.escape(trainigsPlan.amountOfSets)}, ${mysql.escape(trainigsPlan.repeatitions)},
                        ${mysql.escape(trainigsPlan.pauseInbetween)}, ${mysql.escape(trainigsPlan.startingWeight)})`,
            (error, result) => {
                if(error) {
                    console.log(`an error in first query of saveTrainingsPlan ${JSON.stringify(error)}`);
                    reject(error);
                }else{
                    //inserts the repitionsdone into the repitionsdone table 
                    console.log(`insert into trainingsplanrows first query result: ${JSON.stringify(result)}`)
                    const id = result.insertId;

                    con.query(`INSERT INTO repeatitionsDone(id, repeatition) VALUES(?, ?)`, [id, [trainigsPlan.repeatitionsDone]],
                    (error, result) => {
                        if(error) {
                            console.log(`an error has occoured in the secound query: ${JSON.stringify(error)}`);
                            reject(error);
                        }else{
                            //inserts the weightsused in the weights used table
                            console.log(`insert into repeatitionsDone result: ${JSON.stringify(result)}`);

                            con.query(`INSERT INTO weightsUsed(id, weightUsed) VALUES (?, ?)`, [id, [trainigsPlan.weightsUsed]],
                            (error, result) => {
                                if(error) {
                                    console.log(`an error has occoured in the third query: ${JSON.stringify(error)}`);
                                    reject(error);
                                }else{
                                    console.log(`inserted into weightsUsed result: ${JSON.stringify(result)}`);
                                    resolve(id);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
