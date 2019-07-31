'use strict'

const dailyNutrModel = require('../models/dailyNutrModel');

module.exports = {
    /**
     * This function gets all the own food entries from the database, if it cant it will send either an
     * error, or if an empty array if the id/userId couldn't be found
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {next} next 
     */
    get: function(req, res, next) {
        const date = req.params.date;
        const userId = Number(req.user.sub);

        dailyNutrModel.getNutr(date, userId).then((result) => {
            console.log(`getting own nutrients was successful: ${JSON.stringify(result)}`);
            res.status(200).send(result);
        }).catch((err) => {
            console.log(`getting own nutrients was not successful: ${JSON.stringify(err)}`);
            res.status(400).send(err);
        });
    },

    /**
     * This function inserts a new food into the own Food table. It will respond with the 
     * just inserted food
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {next} next 
     */
    post: function(req, res, next) {
        const dailyNutr = req.body;
        dailyNutr.userId = Number(req.user.sub);

        if(dailyNutr) {
            dailyNutrModel.saveNutr(dailyNutr).then((result) => {
                console.log(`saving own nutrients was successful: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((err) => {
                console.log(`saving own nutrients was unsuccessful: ${JSON.stringify(err)}`);
                res.status(400).send(err);
            });
        } else {
            console.log(`requert body was empty`);
            res.status(400).send(`requert body was empty`);
        }
    },

    /**
     * This function updates a food the id has to be set. It will respond with the newly updated food.
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {next} next 
     */
    put: function(req, res, next) {
        const dailyNutr = req.body;
        dailyNutr.userId = Number(req.user.sub);
        if(dailyNutr) {
            dailyNutrModel.update(dailyNutr).then((result) => {
                console.log(`updating own food was successful: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((err) => {
                console.log(`updating own food was unsuccessful: ${JSON.stringify(err)}`);
                res.status(400).send(err);
            });
        } else {
            console.log(`requert body was empty`);
            res.status(400).send(`requert body was empty`);
        }
 
    },
    
    /**
     * This function deletes a food and response with the id of the deleted food.
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {next} next 
     */
    delete: function(req, res, next) {
        const date = req.params.date;
        const userId = Number(req.user.sub);
        if(date) {
            dailyNutrModel.delete(date, userId).then((result) => {
                console.log(`getting own food was successful: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((err) => {
                console.log(`getting own food was not successful: ${JSON.stringify(err)}`);
                res.status(400).send(err);
            });
        } else {
            console.log(`requert id was empty`);
            res.status(400).send(`requert id was empty`);
        }
 
    }
}