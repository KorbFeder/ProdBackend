const multer = require('multer');
const fileFolder = require('./constants').fileFolder;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, fileFolder);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    }
})

module.exports = multer({storage: storage});
 

