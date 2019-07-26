'use strict'

const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');
const {promisify} = require('util');

const con = dbConnection();

const query = promisify(con.query).bind(con);

con.on('connection', (connection) => {
    console.log('new connection to todos is made: ' + connection.threadId);
});

module.exports = {
    getUser: function(username) {
        return query(`SELECT * FROM user WHERE username = ${mysql.escape(username)}`);
    },

    createUser: function(userForm) {
        return query(`INSERT INTO user(id, email, emailVerified, username, password)
                      VALUES (${mysql.escape(userForm.id)}, ${mysql.escape(userForm.email)}, 
                        ${mysql.escape(userForm.emailVerified)}, ${mysql.escape(userForm.username)},
                        ${mysql.escape(userForm.password)})`).then((result) => {
                            return this.getUser(userForm.username);
                        });
    }
}