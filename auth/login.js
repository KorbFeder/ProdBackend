'use strict'

const userModel = require('../models/userModel');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

/**
 * Function to handle the login and the sending of the bearer token for authentication.
 * This function gets a request body with the credentials from the frontend, if the credentials 
 * are in the database and are correct, a bearer token will be created and sent back.
 * Else an error will be sent back
 */
module.exports = (req, res) => {
    if(!req.body) {
        console.log('no request body at login');
        res.status(400).send('no request body');
        return;
    }

    const username = req.body.username;    
    const password = req.body.password;

    validateCredentials(username, password).then((result) => {
        const userId = result.id.toString();
        const expires = 120;

        const jsonPath = path.join(__dirname, '..', 'keys', 'jwtRS256.key');
        const RSA_PRIVATE_KEY = fs.readFileSync(jsonPath, 'utf8');

        const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: expires,
            subject: userId
        });

        res.status(200).json({
            idToken: jwtBearerToken,
            expiresIn: expires,
            userId
        })
    // no access with those credentials
    }).catch((err) => {
        res.status(401).send(`invalid ${err}`);
    });

}

/**
 * Helper function for validating the username and password, will be resolved with result object from the 
 * database, or an error string that contains the reason for the reject
 * 
 * @param {string} username 
 * @param {string} password 
 */
function validateCredentials(username, password) {
    return userModel.getUser(username).then((result) => {
        return new Promise((resolve, reject) => {
            if(result[0].password === password) {
                resolve(result[0]);
            } else {
                console.log('password is not correct');
                reject('password');
           }
        });
    }).catch((err) => {
        return new Promise((resolve, reject) => {
            console.log(`user not in database: ${JSON.stringify(err)}`);
            reject('user');
        })
    })
}