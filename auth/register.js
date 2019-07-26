'use strict'
const userModel = require('../models/userModel');

/**
 * Function to create a user
 */
module.exports = (req, res) => {
    if(req.body && req.body.user) {
        userModel.createUser(req.body.user).then((result) => {
            console.log(`user has been created: ${JSON.stringify(result)}`)
            res.status(200).send(result);
        }).catch((err) => {
            console.log(`registering has failed ${JSON.stringify(err)}`);
            res.status(500).send(`registering has failed ${err}`);
        });
    } else {
        console.log('no request body in register');
        res.status(400).send('no request body in register');
    }
}