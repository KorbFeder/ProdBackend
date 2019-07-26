'use strict'
const userModel = require('../models/userModel');

module.exports = (req, res) => {
    if(req.body) {
        userModel.createUser(req.body).then((result) => {
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