const express = require("express");
const app = express();
const db = require("./sql/db.js");
const s3 = require("./s3.js");
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const { s3Url } = require("./config.json");
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

app.get("/images", (req, res) => {
    //here we do db query, put stuff in session, etc.
    db.getCard().then((result) => {
        //console.log("result from getCard", result);
        var images = result.rows;
        res.json({
            images,
        });
    }).catch((err) => { console.log("err in getCard get /images"), err });
});


app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("file :", req.file);
    const filename = req.file.filename;
    const url = `${s3Url}${filename}`////////////////////////////FIX IT
    db.addInfo(url, req.body.title, req.body.description, req.body.username).then(({ rows }) => {
        console.log(" rows from addInfo.then : ", rows);
        res.json({
            image: rows[0],
        });
    }).catch((err) => { console.log("err n addInfo index.js", err) });

    // console.log("input - req.body :", req.body);
    // if (req.file) {
    //     res.json({
    //         success: true
    //     });
    // } else {
    //     res.json({
    //         success: false
    //     });
    // }
});

app.listen(8080, () => console.log("server is listening..."));