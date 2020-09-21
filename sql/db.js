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
module.exports.deleteImg = (imageId) => {
    return db.query(`DELETE FROM images
    WHERE id = ($1)`, [imageId]
    );
};
module.exports.deleteImgComments = (imageId) => {
    return db.query(`DELETE FROM comments
    WHERE image_id = ($1)`, [imageId]
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
        SELECT * 
        FROM images
        WHERE id = ($1)`, [id]
    );
};
// (SELECT id FROM images WHERE id < ($1)
//   ORDER BY id DESC LIMIT 1) AS prev
// (SELECT id FROM images WHERE id > ($1)
//   ORDER BY id ASC LIMIT 1) AS next

module.exports.getComments = (id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE image_id = ($1)
        ORDER by id DESC
        LIMIT 6`, [id]

    );
};
module.exports.getMoreImages = (topId) => {
    return db.query(
        `SELECT url, title, id, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lowestId" FROM images

        WHERE id < ($1)
        ORDER BY id DESC
        LIMIT 6;
        `,
        [topId]
    );
};

// module.exports.getMoreImages = (topId) => {
//     return db.query(
//         `SELECT * FROM images
//         WHERE id < ($1)
//         ORDER BY id DESC
//         LIMIT 6`,
//         [topId]
//     );
// };
