const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "admin123",
    database: "todolist1"
});

// open the MySQL connection
db.connect(error => {
    if (error) throw error;
    console.log("DB connected");
});

module.exports = db;