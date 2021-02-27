const mysql = require('mysql');
const inquirer = require('inquirer');
const conTable = require('console.table');

// important connection criteria | Password temporarily set to
// 'password' for this assignment
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeeDB',
});

// create connection
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
  });

// Initial Prompts
function ask () {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'input',
                choices: [
                    'View All Employees',
                    'View Employees by Manager',
                    'View All Roles',
                    'View All Departments',
                    'Add New Employee',
                    'Add New Role',
                    'Add New Department',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'Delete Employee',
                    'Delete Role',
                    'Delete Department',
                    'Exit',
                ],
                message: 'What would you like to do?'
            },
        ])
        .then((answer) => {
            const { input } = answer;
        })
    }



//   connection.end();