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
     * the save was successful the function will respond with the new table.
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
    },

    /**
     * This function updates the trainings plan in the database, than sends a response, if the 
     * update was successful than it will return the new trainings plan.
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    put: function(req, res, next) {
        const trainingsPlan = req.body;
        fitPlannerModel.updateTrainingsPlan(trainingsPlan).then((result) => {
            console.log(`updated trainingsPlan: ${JSON.stringify(result)}`);
            res.status(200).send(result);
        }).catch((error) => {
            console.log(`error was thrown: ${JSON.stringify(error)}`);
            res.status(405).send(error);
        });
    },

    /**
     * This function deletes an object, will not return anything, but will throw an error, if something happened.
     * It needs an phase and a day as req.param, if those are empty nothing will get deleted.
     * The Url should have the form: /api/fit/1/2 (where '1' is the phase and '2' is the day)
     * This returns the id of the deleted trainings plan.
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    delete: function(req, res, next) {
        const phase = req.params.phase;
        const day = req.params.day;
        if(phase && day) {
            fitPlannerModel.deleteTrainingsPlan(phase, day).then((result) => {
                console.log(`deleted trainingsPlan: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`error when trying to delete trainingsPlan: ${JSON.stringify(error)}`);
                res.status(405).send(result);
            });
        }else{
            console.log(`no day and phase was set when trying to delete a trainings plan`);
            res.status(400).send(result);
        }
    }
}