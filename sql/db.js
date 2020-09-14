const spicedPg = require("spiced-pg");
var db = spicedPg('postgres:postgres:postgres@localhost:5432/images');

module.exports.getCard = () => {
    return db.query(`
        SELECT * FROM images`
    );
};