const express = require("express");
const app = express();
const db = require("./sql/db.js");


app.use(express.static("public"));

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

app.listen(8080, () => console.log("server is listening..."));