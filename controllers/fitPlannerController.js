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

    /**
     * This function saves the trainingsPlans to the Database and than sends an response, if
     * the save was successful the function will send the response object of each row saved.
     * If not the Database will throw a reject error.
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    post: function(req, res, next) {
        const trainingsPlan = req.body;
        fitPlannerModel.saveTrainingsPlan(trainingsPlan).then((result) => {
            console.log(`inserted into trainingsPlan: ${JSON.stringify(result)}`);
            res.status(200).send(result);
        }).catch((error) => {
            console.log(`error was thrown: ${JSON.stringify(error)}`);
            res.status(405).send(error);
        });
    }
}