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
    startScreen();
  });

  const startScreen = () => {
    console.log(`\\\\\\\\\\\\EMPLOYEE TRACKER\\\\\\\\\\\\`);
    initialPrompt();
  };

// Initial Prompts
const initialPrompt = () => {
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

            switch (input) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                
                case 'View Employees by Manager':
                    viewEmployeeByManager();
                    break;

                case 'View All Roles':
                    viewAllRoles();
                    break;
                    
                case 'View All Departments':
                    viewAllDepartments();
                    break;

                case 'Add New Employee':
                        addEmployee();
                        break;
                        
                case 'Add New Role':
                        addRole();
                        break;

                case 'Add New Department':
                    addDepartment();
                    break;
                        
                case 'Update Employee Role':
                    updateRole();
                    break;

                case 'Update Employee Manager':
                    updateManager();
                    break;
                            
                case 'Delete Employee':
                    deleteEmployee();
                    break;

                case 'Delete Role':
                    deleteRole();
                    break;
                                
                case 'Delete Department':
                    deleteDepartment();
                    break;

                case 'Exit':
                    console.log("Goodbye!");
                    connection.end
                    break;
                
                default:
                    console.log("Please make a seletion");
                    initialPrompt();
            }
        });
    };

// Defining Variables //
const viewAllEmployees = () => {
    console.log("Viewing All Employees...\n");

    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name";

    query += "role.salary, concat(manager.first_name, ' ', manager.last_name) as manager FROM (((role INNER JOIN department ON department.id =";

    query += "role.department_id) INNER JOIN employee ON employee.role_id = role.id) LEFT JOIN employee manager on manager.id = employee.manager_id);";

    connection.query(query, (err, res) => {
        if (err) throw err;
        const table = conTable.getTable(res);
        console.log(table);
        initialPrompt();
    })
}


