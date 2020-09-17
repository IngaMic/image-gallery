const spicedPg = require("spiced-pg");
var db = spicedPg('postgres:postgres:postgres@localhost:5432/images');

module.exports.getCard = () => {
    return db.query(`
        SELECT * FROM images
        ORDER by id DESC
        LIMIT 6`
    );
};
module.exports.getlowestId = () => {
    return db.query(`
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1`
    );
};
module.exports.addInfo = (url, title, description, username) => {
    return db.query(`
    INSERT INTO images (url, title, description, username)
    VALUES ($1, $2, $3, $4) RETURNING * `, [url, title, description, username]
    );
};
//store comment in a new comments table
//new comment will go up  ORDER by id DESC`  // adding a comment works just like file
module.exports.addComment = (comment, username, image_id) => {
    return db.query(`
    INSERT INTO comments (comment, username, image_id)
    VALUES ($1, $2, $3) RETURNING *`, [comment, username, image_id]
    );
};
module.exports.getImg = (id) => {
    return db.query(`
        SELECT * FROM images
        WHERE id = ($1)`, [id]
    );
};
module.exports.getComments = (id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE image_id = ($1)
        ORDER by id DESC
        LIMIT 6`, [id]

    );
};
module.exports.getMoreImages = (lastId) => {
    return db.query(
        `SELECT * FROM images
        WHERE id > ($1)
        ORDER BY id DESC
        LIMIT 6`,
        [lastId]
    );
};


