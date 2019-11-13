'use strict'
const {promisify} = require('util');
const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');

const con = dbConnection();

const query = promisify(con.query).bind(con);

con.on('connection', (connection) => {
    console.log('new connection to fitPlanner is made: ' + connection.threadId);
});

/** 
 * The trainings plans have the following structure:
 * (an array which holds some training plans, a training plan is an Array that contains the rows as object)
 * [
 *    [        //table-begin
 *        {},  //row 
 *        {},  //row
 *    ],       //table-end
 *    [
 *        {},
 *        {},
 *    ],
 * ]
 * */
module.exports = {
    /**
     * This function gets all the Trainings plans of the Database and returns them in the resolve object of
     * the Promise, if it failed it will return the error log in the reject object of the rejection.
     */
    getAllTrainingsPlans: function(userId) {
        return getTablesHelper(`SELECT * FROM trainingsPlanRows WHERE userId = ${mysql.escape(userId)}`, userId);
    },

    /**
     * This function gets the Trainings plans with the given phase  and day of the Database and 
     * returns them in the resolve object of the Promise, if it fails it will return the error 
     * log in the reject object of the rejection.
     * 
     * @param {number} phase
     * @param {number} day
     */
    getTrainingsPlan: function(userId, phase, day) {
        return getTablesHelper(`SELECT * FROM trainingsPlanRows WHERE phase = ${mysql.escape(phase)} AND dayNr = ${mysql.escape(day)} AND userId = ${mysql.escape(userId)}`, userId);
    },

    /**
     * This function inserts a trainingsplan into the trainingsPlanRows table and also adds the reapitionsDone
     * and weightsUsed in their respective table. This is needed since both the last 2 are arrays and are needed
     * to be saved extra since they can be of dynamic size.
     * Returns the saved trainings Plan.
     *  
     * @param {object} trainigsPlan 
     */
    saveTrainingsPlan: async function(trainigsPlans) {
        let id;
        const promises = [];
        for(const trainigPlan of trainigsPlans){
            promises.push(await query((`INSERT INTO trainingsPlanRows(phase, dayNr, muscle, excercise, amountOfSets, repeatitions, pauseInbetween, startingWeight, userId)
                        VALUES(${mysql.escape(trainigPlan.phase)}, ${mysql.escape(trainigPlan.dayNr)}, 
                        ${mysql.escape(trainigPlan.muscle)}, ${mysql.escape(trainigPlan.excercise)}, 
                        ${mysql.escape(trainigPlan.amountOfSets)}, ${mysql.escape(trainigPlan.repeatitions)},
                        ${mysql.escape(trainigPlan.pauseInbetween)}, ${mysql.escape(trainigPlan.startingWeight)}),
                        ${mysql.escape(trainigPlan.userId)}`)
            ).then((result) => {
                id = result.insertId;
                return query(`INSERT INTO repeatitionsDone(id, repeatition, userId) VALUES ?`, [trainigPlan.repeatitionsDone.map(elem => [id, elem]), trainigPlan.userId]);
            }).then((result) => {
                return query(`INSERT INTO weightsUsed(id, weightUsed, userId) VALUES ?`, [trainigPlan.weightsUsed.map(elem => [id, elem]), trainigPlan.userId]);
            }));
        }
        return Promise.all(promises);
    },

    /**
     * This function updates a trainings plan if and than returns the updated trainings plan. If not then it
     * will return a reject object
     * 
     * @param {object} trainigsPlans 
     */
    updateTrainingsPlan: async function(trainigsPlans) {
        let id;
        const promises = [];
        for(const trainigPlan of trainigsPlans){
            promises.push(await query(`UPDATE trainingsPlanRows SET
                        phase = ${mysql.escape(trainigPlan.phase)}, dayNr = ${mysql.escape(trainigPlan.dayNr)}, 
                        muscle = ${mysql.escape(trainigPlan.muscle)}, excercise = ${mysql.escape(trainigPlan.excercise)}, 
                        amountOfSets = ${mysql.escape(trainigPlan.amountOfSets)}, repeatitions = ${mysql.escape(trainigPlan.repeatitions)},
                        pauseInbetween = ${mysql.escape(trainigPlan.pauseInbetween)}, startingWeight = ${mysql.escape(trainigPlan.startingWeight)}
                        WHERE id = ${mysql.escape(trainigPlan.id)}, userId = ${mysql.escape(trainigPlan.userId)}`).then((result) => {
                id = trainigPlan.id;
                return query(`DELETE FROM repeatitionsDone WHERE id = ${mysql.escape(id)} AND userId = ${mysql.escape(trainigPlan.userId)}`);
            }).then((result) => {
                return query(`DELETE FROM weightsUsed WHERE id = ${mysql.escape(id)} AND userId = ${mysql.escape(trainigPlan.userId)}`);
            }).then((result) => {
                return query(`INSERT INTO repeatitionsDone(id, repeatition, userId) VALUES ?`, [trainigPlan.repeatitionsDone.map(elem => [id, elem]), trainigPlan.userId]);
            }).then((result) => {
                return query(`INSERT INTO weightsUsed(id, weightUsed, userId) VALUES ?`, [trainigPlan.weightsUsed.map(elem => [id, elem]), trainigPlan.userId]);
            }));
        }
        return Promise.all(promises);
    },

    /**
     * This function deletes a trainingsPlan, if the trainingsPlan was not found it will return an sql error.
     * This function first gets all trainingsPlans and than deletes depending of the id of each row of an 
     * trainingsPlan all elements from the other 2 tables, repeatitionsDone and weightsUsed.
     * This returns the Ids of the deleted rows
     * 
     * @param {number} phase 
     * @param {number} day 
     */
    deleteTrainingsPlan: async function(userId, phase, day) {
        return query(`SELECT * FROM trainingsPlanRows 
            WHERE phase = ${mysql.escape(phase)} AND userId = ${mysql.escape(userId)}
                AND dayNr = ${mysql.escape(day)}`).then(async (result) => {
            const promises = [];
            result.forEach(async (row) => {
                promises.push(await query(`DELETE FROM weightsUsed WHERE id = ${mysql.escape(row.id)} AND userId = ${mysql.escape(userId)}`).then((result) => {
                    return query(`DELETE FROM repeatitionsDone WHERE id = ${mysql.escape(row.id)} AND userId = ${mysql.escape(userId)}`);
                }).then((result) => {
                    return query(`DELETE FROM trainingsPlanRows WHERE id = ${mysql.escape(row.id)} AND userId = ${mysql.escape(userId)}`);
                }).then((result) => {
                    return new Promise((resolve, reject) => {
                        resolve(id);
                    });
                }));               
            });
            return Promise.all(promises);
        })
    }
}

/**
 * Because the table rows are stored in one SQL-table, they have to be brought into the right JSON structure
 * which means creating an array that contains an array (table) which has the rows as objects.
 * This function needs the result object of the last sql query, it will return the object in the right Form
 * [
 *    [        //table-begin
 *        {},  //row 
 *        {},  //row
 *    ],       //table-end
 *    [
 *        {},
 *        {},
 *    ],
 * ]
 * 
 * @param {object} result 
 */
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

/**
 * This helper function is used for either the get with params or the get without params.
 * It will either give back all tables or just the one for which it was asked for.
 * It needs an SQL query string as argument, that searches for some table/s.
 * Returns a Promise which holds the table/s
 * 
 * @param {string} sql 
 */
function getTablesHelper(sql, userId){
    let planResult;
    return query(sql).then((result) => {
        planResult = result;
        return query(`SELECT * FROM repeatitionsDone WHERE userId = ${mysql.escape(userId)}`);            
    }).then((result) => {
        //inserts the array of repeatition into the table
        result.forEach((row) => {
            const index = planResult.findIndex(x => x.id === row.id);
            if(index !== null && index !== undefined && index > -1){
                if(planResult[index].repeatition) {
                    planResult[index].repeatition.push(row.repeatition);
                }else{
                    planResult[index].repeatition = [row.repeatition];
                }
            }
        });
        return query(`SELECT * FROM weightsUsed WHERE userId = ${mysql.escape(userId)}`);
    }).then((result) => {
        return new Promise((resolve, reject) => {
            //inserts the array of weights used into the table
            result.forEach((row) => {
                const index = planResult.findIndex(x => x.id === row.id);
                if(index !== null && index !== undefined && index > -1){
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
}