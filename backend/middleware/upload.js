const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require('dotenv').config();

const storage = new GridFsStorage({
    //db: connection,
    url: process.env.DB_CONNECTION,
    options: { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.DB_NAME },
    file: (req, file) => {
        const match = ["image/png", "image/jpg", "image/jpeg"];

        if(match.indexOf(file.mimetype) === -1)
        {
            return `${Date.now()}-su-${file.originalname}`;
        }

        // console.log('store');
        return {
            bucketName: 'posts',
            filename: `${Date.now()}-su-${file.originalname}`, 
            request: req
        }
    }
})

console.log('store', storage)

module.exports = multer({ storage });