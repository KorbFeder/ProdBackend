'use strict'

const fitPlannerModel = require('../models/fitPlannerModel');

module.exports = {
    /**
     * This function retrieves one or more training plans, if the url has 2 params, one for
     * phase and one for day it will return 1 training plan, else it will return all of them.
     * url has the following form: /api/fit/1/2 (to return 1 table, '1' being phase '2' being day)
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    get: function(req, res, next) {
        const phase = req.params.phase;
        const day = req.params.day;
        if(!phase && !day) {
            fitPlannerModel.getAllTrainingsPlans().then((result) => {
                console.log(`got all the training planes: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`an error ocurred, when trying to get all training plans: ${JSON.stringify(error)}`);
                res.status(405).send(error);
            });
        }else{
            fitPlannerModel.getTrainingsPlan(phase, day).then((result) => {
                console.log(`got one training plan: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`an error ocurred, when trying to get one training plan: ${JSON.stringify(error)}`);
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