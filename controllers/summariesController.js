'use strict';

const summariesModel = require('../models/summariesModel');

module.exports = {
    get: function(req, res, next) {
        const id = req.params.id;
        const userId = Number(req.user.sub);
        if(!id) {
            summariesModel.getSummaries(userId).then((result) => {
                console.log(`getting all summaries was successful ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`getting all summaries had an error ${JSON.stringify(result)}`);
                res.status(405).send(error);
            });
        } else {
            summariesModel.getSummaries(userId, id).then((result) => {
                console.log(`getting one Summary was successful ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`getting one Summary had an error: ${JSON.stringify(error)}`);
                res.status(405).send(error);
            })
        }
    },

    post: function(req, res, next) {
        const summaries = req.body;
        summaries.userId = Number(req.user.sub);
        
        if(summaries.id) {
            summariesModel.saveSummary(summaries).then((result) => {
                console.log(`saving a summary was a success: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`saving a summray had an error ${JSON.stringify(error)}`);
                res.status(405).send(error);
            });
        } else {
            console.log('request body was empty');
            res.status(400).send('request body was empty');
        }
    },

    put: function(req, res, next) {
        const summray = req.body;
        summray.userId = Number(req.user.sub);
        if(summray.id) {
            summariesModel.updateSummary(summray).then((result) => {
                console.log(`updating the summary was a success: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`updating the summary had an error: ${JSON.stringify(error)}`);
                res.status(200).send(error);
 
            });
        } else {
            console.log('request body was empty')
            res.status(400).send('request body was empty');
        }
    },

    delete: function(req, res, next) {
        const id = req.params.id;
        const userId = Number(req.user.sub);
        if(id) {
            summariesModel.deleteSummary(id, userId).then((result) => {
                console.log(`deleting a summary was successful ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`deleting a summary had an error ${JSON.stringify(error)}`);
                res.status(200).send(error);
            });
        } else {
            console.log('id param was not set when deleting summray');
            res.status(400).send('id param was not set when deleting summray');
        }
    }
};