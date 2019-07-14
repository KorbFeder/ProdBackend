'use strict'

/**
 * Alive route to check if the backend is running, used for the frontend to check.
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
function alive(req, res, next){
    console.log('alive');
    res.send(true);
}

module.exports = alive;