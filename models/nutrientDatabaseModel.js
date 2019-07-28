'use strict'

const nutrientDatabaseConnection = require('../config/nutrientDatabaseConnection');
const mysql = require('mysql');
const { promisify } = require('util');

const con = nutrientDatabaseConnection();

const query = promisify(con.query).bind(con);

module.exports = {
    getFood: function(name, manufacturer) {
        let manufSearch = '';
        if(manufacturer) {
            manufSearch = `OR ManufacName LIKE '%${manufacturer}%'`;
        }
        return query(`SELECT f.NDB_No, f.ComName, f.Shrt_Desc, f.Long_Desc, f.ManufacName, f.SciName, f.N_Factor, f.Pro_Factor,
                        f.Fat_Factor, f.CHO_Factor, g.FdGrp_Desc
                      FROM FOOD_DES f JOIN FD_GROUP g ON g.FdGrp_Cd = f.FdGrp_Cd
                      WHERE ComName LIKE '%${name}%' OR Shrt_Desc LIKE '%${name}%' ${mysql.escape(manufSearch)}`);
    },

    getNutr: function(NDB_No) {
        return query(`SELECT data.Nutr_val, def.Units, def.Tagname, def.NutrDesc
                      FROM NUT_DATA data JOIN NUTR_DEF def ON def.Nutr_No = data.Nutr_No
                      WHERE NDB_No = ${mysql.escape(NDB_No)}`);
    }
}