const mysql = require('mysql');
// const inquirer = require('inquirer');
// const conTable = require('console.table');

// important connection criteria
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employeeDB',
});

// create connection
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    connection.end();
  });