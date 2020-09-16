const express = require("express");
const app = express();
const db = require("./sql/db.js");
const s3 = require("./s3.js");
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const { s3Url } = require("./config.json");
app.use(express.static("public"));
app.use(express.json());
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

app.get("/images/:id", (req, res) => {
    console.log("req.params from index.js", req.params)
    db.getImg(req.params.id).then((result) => {
        //console.log("result from getImg", result);
        //console.log("result.rows[0]", result.rows[0]);
        //console.log("result.rows[0].id", result.rows[0].id);
        var img = result.rows[0];
        db.getComments(result.rows[0].id).then((list) => {
            var comments = list.rows;
            console.log("comments", comments);
            res.json({
                img,
                comments,
            });

        }).catch((err) => { console.log("err in getComments get /img", err) });

    }).catch((err) => { console.log("err in getImg get /img", err) });
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
});

app.post("/comment", (req, res) => {
    console.log("req.body :", req.body);
    db.addComment(req.body.comment, req.body.name, req.body.image_id).then(({ rows }) => {
        console.log(" rows from addComments.then : ", rows);
        res.json({
            comment: rows[0],
        });
    }).catch((err) => { console.log("err in addInfo index.js", err) });
});


app.listen(8080, () => console.log("server is listening..."));