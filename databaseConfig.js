const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "Shelby",
    password: "Shelby1234",
    database : 'shelbydb'
  });        

connection.connect(function(err) {
    if (err) { throw err; };
    console.log("Connected from databaseConfig.js!");
});

module.exports = {
    connection : connection,
} 