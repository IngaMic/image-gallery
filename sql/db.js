const spicedPg = require("spiced-pg");
var db = spicedPg('postgres:postgres:postgres@localhost:5432/images');

module.exports.getCard = () => {
    return db.query(`
        SELECT * FROM images`
    );
};
module.exports.addInfo = (title, description, username, file) => {
    return db.query(`
    INSERT INTO images (title, description, username, file)
    VALUES ($1, $2, $3, $4) RETURNING id `, [title, description, username, file]
    );
};