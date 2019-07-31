'use strict'

const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');
const { promisify } = require('util');

const con = dbConnection();

const query = promisify(con.query).bind(con);

module.exports = {
    /**
     * This function gets either all foods or just one depending on wether the id field is set.
     * 
     * @param {number} id 
     * @param {number} userId 
     */
    getOwnFood: function(name, userId) {
        if(!id) {
            return query(`SELECT * FROM ownFood WHERE userId = ${mysql.escape(userId)}`);
        } else {
            return query(`SELECT * FROM ownFood WHERE foodName = ${mysql.escape(name)} AND userId = ${mysql.escape(userId)}`);
        }
    },

    getFoodByDay: function(day_id, userId) {
        return query(`SELECT * FROM ownFood WHERE day_id = ${mysql.escape(day_id)} AND userId = ${mysql.escape(userId)}`);
    },

    /**
     * This function updates a food.
     * 
     * @param {ownFood} ownFood 
     */
    update: function(ownFood) {
        return query(`UPDATE ownFood 
                      SET foodName = ${mysql.escape(ownFood.foodName)}, description = ${mysql.escape(ownFood.description)},
                        ManufacName = ${mysql.escape(ownFood.ManufacName)}, fat = ${mysql.escape(ownFood.fat)}, carb = ${mysql.escape(ownFood.carb)}, 
                        protein = ${mysql.escape(ownFood.protein)}, userId = ${mysql.escape(ownFood.userId)}
                      WHERE id = ${mysql.escape(ownFood.id)} AND userId = ${mysql.escape(ownFood.userId)}`).then(() => {
                          return this.getOwnFood(ownFood.id, ownFood.userId);
                      });
    },

    /**
     * This function saves a food.
     * 
     * @param {ownFood} ownFood 
     */
    saveOwnFood: function(ownFood) {
        return query(`INSERT INTO ownFood(id, foodName, description, ManufacName, fat, carb, protein, userId)
                      VALUES (${mysql.escape(ownFood.id)}, ${mysql.escape(ownFood.foodName)}, ${mysql.escape(ownFood.description)},
                      ${mysql.escape(ownFood.ManufacName)}, ${mysql.escape(ownFood.fat)}, ${mysql.escape(ownFood.carb)}, ${mysql.escape(ownFood.protein)},
                      ${mysql.escape(ownFood.userId)})`).then((result) => {
                          return this.getOwnFood(result.insertId, ownFood.userId);
                      });
    },

    /**
     * This function deletes a food.
     * 
     * @param {number} id 
     * @param {number} userId 
     */
    delete: function(id, userId) {
        return query(`DELETE FROM ownFood WHERE id = ${mysql.escape(id)} AND userId = ${mysql.escape(userId)}`).then((result) => {
            return new Promise((resolve, reject) => {
                resolve(id);
            });
        });
    }
}