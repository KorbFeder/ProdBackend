'use strict'

const nutrModel = require('../models/nutrientDatabaseModel');

module.exports = {
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