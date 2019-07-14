'use strict'
const {promisify} = require('util');
const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');

const con = dbConnection();

const query = promisify(con.query).bind(con);

con.on('connection', (connection) => {
    console.log('new connection to fitPlanner is made: ' + connection.threadId);
});

module.exports = {
    /**
     * This function gets all the Trainings plans of the Database and returns them in the resolve object of
     * the Promise, if it failed it will return the error log in the reject object of the rejection.
     */
    getAllTrainingsPlans: function() {
        let planResult;
        return query('SELECT * FROM trainingsPlanRows').then((result) => {
            planResult = result;
            return query('SELECT * FROM repeatitionsDone');            
        }).then((result) => {
            //inserts the array of repeatition into the table
            result.forEach((row) => {
                const index = planResult.findIndex(x => x.id === row.id);
                if(index !== null && index !== undefined){
                    if(planResult[index].repeatition) {
                        planResult[index].repeatition.push(row.repeatition);
                    }else{
                        planResult[index].repeatition = [row.repeatition];
                    }
                }
            });
            return query('SELECT * FROM weightsUsed');
        }).then((result) => {
            return new Promise((resolve, reject) => {
                //inserts the array of weights used into the table
                result.forEach((row) => {
                    const index = planResult.findIndex(x => x.id === row.id);
                    if(index !== null && index !== undefined){
                        if(planResult[index].weightsUsed){
                            planResult[index].weightsUsed.push(row.weightUsed);
                        } else {
                            planResult[index].weightsUsed = [row.weightUsed];
                        }
                    }
                });
                const tables = arraySplitter(planResult);
                resolve(tables);
            });
        });
    },

    /**
     * This function gets the Trainings plans with the given phase  and day of the Database and 
     * returns them in the resolve object of the Promise, if it fails it will return the error 
     * log in the reject object of the rejection.
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
    saveTrainingsPlan: async function(trainigsPlans) {
        let id;
        const promises = [];
        for(const trainigPlan of trainigsPlans){
            promises.push(await query((`INSERT INTO trainingsPlanRows(phase, dayNr, muscle, excercise, amountOfSets, repeatitions, pauseInbetween, startingWeight)
                        VALUES(${mysql.escape(trainigPlan.phase)}, ${mysql.escape(trainigPlan.dayNr)}, 
                        ${mysql.escape(trainigPlan.muscle)}, ${mysql.escape(trainigPlan.excercise)}, 
                        ${mysql.escape(trainigPlan.amountOfSets)}, ${mysql.escape(trainigPlan.repeatitions)},
                        ${mysql.escape(trainigPlan.pauseInbetween)}, ${mysql.escape(trainigPlan.startingWeight)})`)
            ).then((result) => {
                id = result.insertId;
                return query(`INSERT INTO repeatitionsDone(id, repeatition) VALUES ?`, [trainigPlan.repeatitionsDone.map(elem => [id, elem])]);
            }).then((result) => {
                return query(`INSERT INTO weightsUsed(id, weightUsed) VALUES ?`, [trainigPlan.weightsUsed.map(elem => [id, elem])]);
            }));
        }
        return Promise.all(promises);
    } 
}

function arraySplitter(result) {
    const allPlans = [];
    result.sort((x, y) => x.phase - y.phase || x.dayNr - y.dayNr);
    let phase = result[0].phase;
    let dayNr = result[0].dayNr;
    let trPlan = [];
    for(const row of result) {
        if(row.dayNr == dayNr && row.phase == phase) {
            trPlan.push(row);
        } else {
            allPlans.push(trPlan);
            trPlan = new Array();
            phase = row.phase;
            dayNr = row.dayNr;
            trPlan.push(row);
        }
    }
    allPlans.push(trPlan);
    return allPlans;
}
