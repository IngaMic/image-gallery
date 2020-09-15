const express = require("express");
const app = express();
const db = require("./sql/db.js");
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

app.use(express.static("public"));
//////////////No changes here ////////////////////////////////////
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
////////////////////////////////////////////////////////////////////

// let cuteAnimals = [
//     {
//         name: "giraffe",
//         cutenessScore: 7
//     },
//     {
//         name: "capybara",
//         cutenessScore: 10
//     },
//     {
//         name: "quoka",
//         cutenessScore: 10
//     },
//     {
//         name: "penguin",
//         cutenessScore: 10
//     },
// ];
app.get("/images", (req, res) => {
    //console.log("GET cute-animals has been hit!!!!!");
    //here we do db query, put stuff in session, etc. for now (before db) we have an array hardcoded _up
    db.getCard().then((result) => {
        //console.log("result from getCard", result);
        var images = result.rows;
        res.json({
            images,
        });
    }).catch((err) => { console.log("err in getCard get /images"), err });
});

app.post("/upload", uploader.single("file"), (req, res) => {
    console.log("file :", req.file);
    console.log("input - req.body :", req.body);
    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.listen(8080, () => console.log("server is listening..."));