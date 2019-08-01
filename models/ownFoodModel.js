'use strict'

const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');
const { promisify } = require('util');

const con = dbConnection();

const query = promisify(con.query).bind(con);

/**
 *    id: number;
 *    NDB_No: number;
 *
 *    Long_Desc: string;
 *    Shrt_Desc: string;
 *    ManufacName: string;
 *    SciName: string;
 *    FdGrp_Desc: string;
 *    ComName: string;
 *
 *    N_Factor: number;
 *    CHO_Factor: number;
 *    Fat_Factor: number;
 *    Pro_Factor: number;
 *    fat: number;
 *    carb: number;
 *    protein: number;
 *
 *    day_id: number;
 *    weight: number;
 *    meal: string;
 */

module.exports = {
    /**
     * This function gets either all foods or just one depending on wether the id field is set.
     * 
     * @param {number} id 
     * @param {number} userId 
     */
    getOwnFood: function(id, userId) {
        if(!id) {
            return query(`SELECT * FROM ownFood WHERE userId = ${mysql.escape(userId)}`);
        } else {
            return query(`SELECT * FROM ownFood WHERE id = ${mysql.escape(id)} AND userId = ${mysql.escape(userId)}`);
        }
    },

    getFoodByName: function(name, userId) {
        return query(`SELECT * FROM ownFood WHERE userId = ${mysql.escape(userId)} AND Shrt_Desc LIKE %${name}%`);
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
                      SET NDB_No = ${mysql.escape(ownFood.NDB_No)}, Long_Desc = ${mysql.escape(ownFood.Long_Desc)},
                        Shrt_Desc = ${mysql.escape(ownFood.Shrt_Desc)}, ManufacName = ${mysql.escape(ownFood.ManufacName)}, 
                        SciName = ${mysql.escape(ownFood.SciName)}, FdGrp_Desc = ${mysql.escape(ownFood.FdGrp_Desc)}, 
                        ComName ${mysql.escape(ownFood.ComName)}, N_Factor ${mysql.escape(ownFood.N_Factor)},
                        CHO_Factor = ${mysql.escape(ownFood.CHO_Factor)}, Fat_Factor = ${mysql.escape(ownFood.Fat_Factor)}, Pro_Factor ${mysql.escape(ownFood.Pro_Factor)},
                        fat = ${mysql.escape(ownFood.fat)}, carb = ${mysql.escape(ownFood.carb)}, protein ${mysql.escape(ownFood.protein)},
                        day_id ${mysql.escape(ownFood.day_id)}, weight = ${mysql.escape(ownFood.weight)}, 
                        meal = ${mysql.escape(ownFood.meal)}
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
        return query(`INSERT INTO ownFood(id, NDB_No, Long_Desc, Shrt_Desc, ManufacName, SciName, FdGrp_Desc,
                        ComName, N_Factor, CHO_Factor, Fat_Factor, Pro_Factor, fat, carb, protein, userId, day_id,
                        weight, meal)
                      VALUES (${mysql.escape(ownFood.id)}, ${mysql.escape(ownFood.NDB_No)}, ${mysql.escape(ownFood.Long_Desc)},
                      ${mysql.escape(ownFood.Shrt_Desc)}, ${mysql.escape(ownFood.ManufacName)}, ${mysql.escape(ownFood.SciName)},
                      ${mysql.escape(ownFood.FdGrp_Desc)}, ${mysql.escape(ownFood.ComName)}, ${mysql.escape(ownFood.N_Factor)},
                      ${mysql.escape(ownFood.CHO_Factor)}, ${mysql.escape(ownFood.Fat_Factor)}, ${mysql.escape(ownFood.Pro_Factor)},
                      ${mysql.escape(ownFood.fat)}, ${mysql.escape(ownFood.carb)}, ${mysql.escape(ownFood.protein)},
                      ${mysql.escape(ownFood.userId)}, ${mysql.escape(ownFood.day_id)}, ${mysql.escape(ownFood.weight)}, 
                      ${mysql.escape(ownFood.meal)})`).then((result) => {
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