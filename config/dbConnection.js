const mysql = require('mysql');

module.exports = () => {
    return mysql.createPool({
        host: 'producitvity_db',
        user: 'admin',
        password: 'admin', 
        database: 'productivity_db',
        connectionLimit: '10'
    });

}