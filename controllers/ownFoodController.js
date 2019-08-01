'use strict'

const ownFoodModel = require('../models/ownFoodModel');

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
        const id = req.params.id;
        const name = req.query.name;
        const day_id = req.query.day_id;
        const userId = Number(req.user.sub);

        if(id) {
            ownFoodModel.getOwnFood(id, userId).then((result) => {
                console.log(`getting own food was successful: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((err) => {
                console.log(`getting own food was not successful: ${JSON.stringify(err)}`);
                res.status(400).send(err);
            });
        } else {
            if (name) {
                ownFoodModel.getFoodByName(name, userId).then((result) => {
                    console.log(`getting food by name was successful ${JSON.stringify(result)}`);
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(`getting own food by name was not successful: ${JSON.stringify(err)}`);
                    res.status(400).send(err);
                });
            } else if(day_id) {
                ownFoodModel.getFoodByDay(day_id, userId).then((result) => {
                    console.log(`getting food by day was successful ${JSON.stringify(result)}`);
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(`getting own food by day was not successful: ${JSON.stringify(err)}`);
                    res.status(400).send(err);
                });
            }
        }
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
        const ownFood = req.body;
        ownFood.userId = Number(req.user.sub);
        if(ownFood) {
            ownFoodModel.saveOwnFood(ownFood).then((result) => {
                console.log(`saving own food was successful: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((err) => {
                console.log(`saving own food was unsuccessful: ${JSON.stringify(err)}`);
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
        const ownFood = req.body;
        ownFood.userId = Number(req.user.sub);
        if(ownFood) {
            ownFoodModel.update(ownFood).then((result) => {
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
        const id = req.params.id;
        const userId = Number(req.user.sub);
        if(id) {
            ownFoodModel.delete(id, userId).then((result) => {
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