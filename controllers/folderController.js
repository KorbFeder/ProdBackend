'use strict';

const folderModel = require('../models/folderModel');

module.exports = {
    get: function(req, res, next) {
        const id = req.params.id;
        const userId = Number(req.user.sub);
        if(!id) {
            folderModel.getFolder(userId).then((result) => {
                console.log(`getting all folders was successful ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`getting all folders had an error: ${JSON.stringify(error)}`);
                res.status(405).send(error);
            });
        } else {
            folderModel.getFolder(userId, id).then((result) => {
                console.log(`getting one Folder was successful: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`getting one todo had an error: ${JSON.stringify(error)}`);
                res.status(405).send(error);
            });
        }
    },

    post: function(req, res, next) {
        const folder = req.body;
        folder.userId = Number(req.user.sub);
        if(folder.id) {
            folderModel.saveFolder(folder).then((result) => {
                console.log(`saving a folder was successful ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`saving a folder had an error ${JSON.stringify(error)}`);
                res.status(405).send(error);
            }) 
        } else {
            console.log('request body was empty');
            res.status(400).send('request body was empty');
        }
    },

    put: function(req, res, next) {
        const folder = req.body;
        folder.userId = Number(req.user.sub);
        if(folder.id) {
            folderModel.updateFolder(folder).then((result) => {
                console.log(`updating folder was a success ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                 console.log(`updating folder unsuccessful ${JSON.stringify(error)}`);
                res.status(400).send(error);
            });
        } else {
            console.log('request body was empty');
            res.status(400).send('request body was empty');
        }
    },

    delete: function(req, res, next) {
        const id = req.parmas.id;
        const userId = Number(req.user.sub);
        if(id) {
            folderModel.deleteFolder(userId, id).then((result) => {
                console.log(`deleting a folder was successful ${JSON.stringify(result)}`);
                res.status(200).send(result);
            }).catch((error) => {
                console.log(`deleting a folder was unsuccessful ${JSON.stringify(error)}`);
                res.status(400).send(error);
            });
        } else {
            console.log('id param was not set');
            res.status(400).send('request param was not set');
 
        }
    }

};
