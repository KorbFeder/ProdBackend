'use strict'

const mysql = require('mysql');

module.exports = () => {
    return mysql.createPool({
        host: 'productivity_db_nutrition',
        user: 'root',
        password: 'admin', 
        database: 'productivity_db_nutrition',
        connectionLimit: '10'
    });
}