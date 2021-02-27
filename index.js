const mysql = require('mysql');
const inquirer = require('inquirer');
const conTable = require('console.table');
const promiseMySql = require('mysql-promise')
let dept = [];
let role = [];

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
                    'View Employees by Role',
                    'View Employees by Department',
                    'Add New Employee',
                    'Add New Role',
                    'Add New Department',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'Delete Employee',
                    'Delete Role',
                    'Delete Department',
                    'View Employees by Manager',
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

                case 'View Employees by Role':
                    viewByRole();
                    setTimeout(() => {
                        employeeRole();
                    }, 300);
                    break;
                    
                case 'View Employees by Department':
                    viewByDept();
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

                case 'Delete roles':
                    deleterole();
                    break;
                                
                case 'Delete Department':
                    deleteDepartment();
                    break;

                case 'View Employees by Manager':
                    viewEmployeeByManager();
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

    let query = "SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.names,";

    query += "roles.salary, concat(manager.first_name, ' ', manager.last_name) as manager FROM (((roles INNER JOIN department ON department.id =";

    query += "roles.department_id) INNER JOIN employee ON employee.role_id = roles.id) LEFT JOIN employee manager on manager.id = employee.manager_id);";

    connection.query(query, (err, res) => {
        if (err) throw err;
        const table = conTable.getTable(res);
        console.log(table);
        initialPrompt();
    });
};

const viewByRole = () => {
   role = [];
   connection.query("SELECT roles.title FROM roles", (err, res) => {
       if (err) throw err;
       for (let i = 0; i < res.length; i++) {
           role.push(res[i].title);
       };
    });
};

const viewByDept = () => {
    dept = [];
    connection.query("SELECT department.names FROM department", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            dept.push(res[i].name);
        }
    });
};

const addEmployee = () => {
    roleChoices();
    inquirer
        .prompt([
      {
        name: "first",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "position",
        type: "list",
        message: "What is the employee's position?",
        choices: role,
      },
      {
        name: "managerConfirm",
        type: "confirm",
        message: "Does the employee have a manager?",
      },
      {
        name: "manager",
        type: "input",
        message: "Whate is the manager's id?",
        when: (answers) => answers.manager1 === true,
      },
    ])
    .then(({ first, last, position, manager }) => {
        let newPositionId;
        for (let i = 0; i < role.length; i++) {
          if (role[i] === position) {
            newPositionId = i + 1;
          }
        }
        console.log("Adding new Employee...\n");
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: first,
            last_name: last,
            role_id: newPositionId,
            manager_id: manager,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} Employee Added!\n`);
  
            initialPrompt();
          }
        );
      });
}
