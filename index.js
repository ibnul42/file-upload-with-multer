const express = require('express');
const multer  = require('multer');
const path = require('path');

const app = express();
const UPLOAD_FOLDER = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                            .replace(fileExt, "")
                            .toLowerCase()
                            .split(" ")
                            .join("-") + Date.now();
        cb(null, fileName + fileExt);
    },
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000,
    },
    fileFilter: (req, file, cb) => {
        if( file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg'
        ) {
            cb(null, true);
        } else {
            cb(new Error("File not supported"));
        }

    }
});

app.post('/', upload.single('avatar'), (req, res, next) => {
    res.send("File Uploaded");
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.log(err);
    } else {
        res.send(err.message)
    }
})

app.listen(3000, () => {
    console.log(`App listening in 3000`);
})