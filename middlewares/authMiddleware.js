const expressJwt = require('express-jwt');
const fs = require('fs');
const path = require('path')

module.exports = () => {
    const jsonPath = path.join(__dirname, '..', 'keys', 'jwtRS256.key.pub');
    const RSA_PUBLIC_KEY = fs.readFileSync(jsonPath, 'utf8');

    return expressJwt({secret: RSA_PUBLIC_KEY});

}