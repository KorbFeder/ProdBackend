'use strict'

const mysql = require('mysql');

module.exports = () => {
    /**
     * creates an mysql pool with the same credentials as the mysql docker container
     * a pool can manage multiple connections at once and also does the disconnecting
     */
    return mysql.createPool({
        host: 'db',
        user: 'admin',
        password: 'admin', 
        database: 'productivity_db',
        connectionLimit: '10'
    });

}