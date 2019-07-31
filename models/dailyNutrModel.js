'use strict'

const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');
const { promisify } = require('util');

const con = dbConnection();

const query = promisify(con.query).bind(con);
const ownFoodModel = require('./ownFoodModel');

module.exports = {
    /**
     * This function gets either all daily Nutrients or just one depending on wether the id field is set.
     * 
     * @param {Date} date 
     * @param {number} userId 
     */
    getNutr: async function(date, userId) {
        if(date){
            date = new Date(date).toISOString().split('T')[0];
        }
        const result = await query(`SELECT * FROM dailyNutrient 
                                    WHERE dayNr = ${mysql.escape(date)} AND userId = ${mysql.escape(userId)}`);

        return new Promise( async (resolve, reject) => {
            if(result.length > 0){
                const ownFoods = await ownFoodModel.getFoodByDay(result[0].id, userId);
                const daily = result[0];
                daily.foods = ownFoods;
                resolve(daily);
            } else {
                resolve(null);
            }
        });
    },

    /**
     * This function updates the daily Nutrients of the user.
     * 
     * @param {dailyNutrient} dailyNutrient
     */
    update: function(dailyNutrient) {
        return query(`UPDATE dailyNutrient 
                      SET dayNr = ${mysql.escape(dailyNutrient.dayNr)}, fatGoal = ${mysql.escape(dailyNutrient.fatGoal)},
                        carbGoal = ${mysql.escape(dailyNutrient.carbGoal)}, proteinGoal = ${mysql.escape(dailyNutrient.proteinGoal)},
                        fat = ${mysql.escape(dailyNutrient.fat)}, carb = ${mysql.escape(dailyNutrient.carb)}, 
                        protein = ${mysql.escape(dailyNutrient.protein)}, userId = ${mysql.escape(dailyNutrient.userId)}
                      WHERE id = ${mysql.escape(dailyNutrient.id)} AND userId = ${mysql.escape(dailyNutrient.userId)}`).then(() => {
                          return this.getNutr(dailyNutrient.dayNr, dailyNutrient.userId);
                      });
    },

    /**
     * This function saves a food.
     * 
     * @param {dailyNutrient} dailyNutrient 
     */
    saveNutr: function(dailyNutrient) {
        if(dailyNutrient.dayNr) {
            dailyNutrient.dayNr = new Date(dailyNutrient.dayNr)
        }
        return query(`INSERT INTO dailyNutrient(id, dayNr, fatGoal, carbGoal, proteinGoal, fat, carb, protein, userId)
                      VALUES (${mysql.escape(dailyNutrient.id)}, ${mysql.escape(dailyNutrient.dayNr)},
                      ${mysql.escape(dailyNutrient.fatGoal)}, ${mysql.escape(dailyNutrient.carbGoal)}, 
                      ${mysql.escape(dailyNutrient.proteinGoal)}, ${mysql.escape(dailyNutrient.fat)},
                      ${mysql.escape(dailyNutrient.carb)}, ${mysql.escape(dailyNutrient.protein)}, 
                      ${mysql.escape(dailyNutrient.userId)})`).then((result) => {
                          return this.getNutr(dailyNutrient.dayNr, dailyNutrient.userId);
                      });
    },

    /**
     * This function deletes a food.
     * 
     * @param {Date} date
     * @param {number} userId 
     */
    delete: function(date, userId) {
        return query(`DELETE FROM dailyNutrient WHERE dayNr = ${mysql.escape(date)} AND userId = ${mysql.escape(userId)}`).then((result) => {
            return new Promise((resolve, reject) => {
                resolve(date);
            });
        });
    }
}