'use strict'

const nutrModel = require('../models/nutrientDatabaseModel');

module.exports = {
    /**
     * This function gets an array of food objects, that contain the data about the food.
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {next} next 
     */
    get: function(req, res, next) {
        const name = req.params.name;
        const manufac = req.params.manufac;
        nutrModel.getFood(name, manufac).then((result) => {
            console.log(`getting nutrFood was successful: ${JSON.stringify(result)}`);
            res.status(200).send(result);
        }).catch((err) => {
            console.log(`an error has ocurred when trying to get nutrFood: ${JSON.stringify(err)}`);
            res.status(400).send(err);
        });
    },

    /**
     * This function gets the nutrients corresponding to the foodNr it is given.
     * 
     * @param {Requrest} req 
     * @param {Response} res 
     * @param {next} next 
     */
    getNutr: function(req, res, next) {
        const NDB_No = req.params.NDB_No;
        nutrModel.getNutr(NDB_No).then((result) => {
            console.log(`getting nutrients was successful ${JSON.stringify(result)}`);
            res.status(200).send(result);
        }).catch((err) => {
            console.log(`getting nutrients was unsuccessful ${JSON.stringify(err)}`);
            res.status(400).send(err);
        });
    }
}