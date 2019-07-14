'use strict'

/**
 * Alive route to check if the backend is running, used for the frontend to check.
 * This will return true if the the route '/api/alive/' is reachable.
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
function alive(req, res, next){
    console.log('alive');
    res.status(200).send(true);
}

module.exports = alive;