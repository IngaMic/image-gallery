const spicedPg = require("spiced-pg");
var db = spicedPg('postgres:postgres:postgres@localhost:5432/images');

module.exports.getCard = () => {
    return db.query(`
        SELECT * FROM images
        ORDER by id DESC`
    );
};
module.exports.addInfo = (url, title, description, username) => {
    return db.query(`
    INSERT INTO images (url, title, description, username)
    VALUES ($1, $2, $3, $4) RETURNING * `, [url, title, description, username]
    );
};
