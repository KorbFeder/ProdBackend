'use strict'

const ownFoodModel = require('../models/ownFoodModel');

module.exports = {
    get: function(req, res, next) {
        const id = req.params.id;
        const userId = Number(req.user.sub);

        ownFoodModel.getOwnFood(id, userId).then((result) => {
            console.log(`getting own food was successful: ${JSON.stringify(result)}`);
            res.status(200).send(result);
        }).catch((err) => {
            console.log(`getting own food was not successful: ${JSON.stringify(err)}`);
            res.status(400).send(err);
        });
    },

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

    put: function(req, res, next) {
        const ownFood = req.body;
        //ownFood.userId = Number(req.user.sub);
        ownFood.userId = 1;
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