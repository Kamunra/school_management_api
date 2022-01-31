const mysql = require('mysql');

const db = mysql.createConnection({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USERNAME,
	password : process.env.DB_PASSWORD,
	database : process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    // console.log('db ' + db.state);
});
module.exports = db