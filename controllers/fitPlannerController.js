'use strict'

const fitPlannerModel = require('../models/fitPlannerModel');

module.exports = {
    get: function(req, res, next) {
        const phase = req.params.phase;
        const day = req.params.day;
        if(!phase && !day) {
            fitPlannerModel.getAllTrainingsPlans().then((result) => {
                res.status(200).send(result);
            }).catch((error) => {
                res.status(405).send(error);
            });
        }else{
            fitPlannerModel.getTrainingsPlan(phase, day).then((result) => {
                res.status(200).send(result);
            }).catch((error) => {
                res.status(405).send(error);
            });
        }
    },

    post: function(req, res, next) {
        const trainingsPlan = req.body;
        if(trainingsPlan) {
            Promise.all(fitPlannerModel.saveTrainingsPlan(trainingsPlan)).then((values) => {
                console.log(values);
                res.status(200).send(values);
            }).catch((error) => {
                console.log(error);
                res.status(405).send(error);
            })
        }
    }
}