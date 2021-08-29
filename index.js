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
        console.log(file);
      if (file.fieldname === "avatar") {
        if (
          file.mimetype === "image/png" ||
          file.mimetype === "image/jpg" ||
          file.mimetype === "image/jpeg"
        ) {
          cb(null, true);
        } else {
          cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
        }
      } else if (file.fieldname === "doc") {
        if (file.mimetype === "application/pdf") {
          cb(null, true);
        } else {
          cb(new Error("Only .pdf format allowed!"));
        }
      } else {
        cb(new Error("There was an unknown error!"));
      }
    },
});

app.post(
    "/",
    upload.fields([
      {
        name: "avatar",
        maxCount: 2,
      },
      {
        name: "doc",
        maxCount: 1,
      },
    ]),
    (req, res, next) => {
      res.send("success");
    }
  );

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