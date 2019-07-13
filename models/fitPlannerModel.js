'use strict'

const dbConnection = require('../config/dbConnection');
const mysql = require('mysql');

const con = dbConnection();

con.on('conneciton', (connection) => {
    console.log('new conneciton to fitPlanner is made: ' + connection.threadId);
})