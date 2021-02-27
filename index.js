const mysql = require('mysql');
const inquirer = require('inquirer');
const conTable = require('console.table');
const { type } = require('os');

// Arrays
let depts = ['Marketing', 'Human Resources', 'Customer Service', 'Public Relations', 'Content Creation'];
let pos = ['Sr. Marketing Specialist', 'Jr. Marketing Specialist', 'Marketing Assistant', 'HR Senior', 'HR Junior', 'Customer Service Representative', 'Public Relations Specialist', 'Content Manager', 'Videographer', 'Video Editor', 'Photographer', 'Set Designer', 'Wardrobe Specialist'];

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

                case 'View Employees by Role':
                    viewByRole();
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
 pos = [];
    console.log("View Employees by Role...\n");
   connection.query("SELECT roles.title FROM roles", (err, res) => {
       if (err) throw err;
       for (let i = 0; i < pos.length; i++) {
           pos.push(res[i].title);
       }
   })
};

const viewByDept = () => {
 depts = [];
    console.log("View Employees by Department...\n");
    connection.query("SELECT department.names FROM department", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < depts.length; i++) {
            depts.push(res[i].name);
        }
    });
};

const addEmployee = () => {
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
        choices: pos,
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
        when: (answers) => answers.managerConfirm === true,
      },
    ])
    .then(({ first, last, position, manager }) => {
        let newPositionId;
        for (let i = 0; i < pos.length; i++) {
          if (pos[i] === position) {
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
};

const addRole = () => {
    inquirer
      .prompt([
        {
          name: "dept",
          type: "confirm",
          message: "Is this role in an already existing Department?",
        },
      ])
      .then(({ dept }) => {
        if (dept === false) {
          console.log(
            "\n First Add Department \n --------------\n "
          );
          addDept();
        } else {
          inquirer
            .prompt([
              {
                name: "role",
                type: "input",
                message: "What is the Role?",
              },
              {
                name: "income",
                type: "input",
                message: "What is the salary?",
              },
              {
                name: "dept",
                type: "input",
                message: "What is the department id for this role?",
              },
            ])
            .then(({ role, income, dept }) => {
              console.log("Adding new Role...\n");
              connection.query(
                "INSERT INTO roles SET ?",
                {
                  title: role,
                  salary: income,
                  department_id: dept,
                },
                (err, res) => {
                  if (err) throw err;
                  console.log(`${res.affectedRows} Role Added!\n`);
                  initialPrompt();
                }
              );
            });
        }
      });
  };

const addDepartment = () => {
    inquirer
      .prompt([
        {
          name: "dept",
          type: "input",
          message: "What is the name of the Department?",
        },
      ])
      .then(({ dept }) => {
        console.log("Adding new Department...\n");
        connection.query(
          "INSERT INTO department SET ?",
          {
            names: dept,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} Department Added!\n`);
            initialPrompt();
          }
        );
      });
  };

  const updateRole = () => {
    // roleChoices();
    inquirer
      .prompt([
        {
          name: "id",
          type: "input",
          message:
            "Please enter employee id:",
        },
        {
          name: "roleCon",
          type: "confirm",
          message: "Do you know the role ID of the employees new job?",
        },
        {
          name: "roleID",
          type: "input",
          message: "Enter the NEW role ID:",
          when: (answer) => answer.roleCon === true,
        },
        {
          name: "newRole",
          type: "list",
          message: "Please choose the role:",
          choices: pos,
          when: (answer) => answer.roleCon === false,
        },
      ])
      .then(({ id, roleCon, roleID, newRole }) => {
        let newRoleId;
        if (roleCon === true) {
          newRoleId = roleID;
        } else {
          for (let i = 0; i < pos.length; i++) {
            if (pos[i] === newRole) {
              newRoleId = i + 1;
            }
          }
        }
  
        console.log("\nUpdating Employee Role...\n");
        connection.query(
          "UPDATE employee SET ? WHERE ?",
          [
            {
              id: newRoleId,
            },
            {
              id: id,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} Employee updated!\n`);
            initialPrompt();
          }
        );
      });
  };

  const deleteEmployee = () => {
    inquirer
      .prompt([
        {
          name: "employeeID",
          message: "Please provide the Employee ID of employee you would like to delete:",
          type: "input",
        },
      ])
      .then(({ employeeID }) => {
        connection.query(
          "DELETE FROM employee WHERE ?",
          {
            id: employeeID,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} Employee deletion Successful!\n`);
            initialPrompt();
          }
        );
      });
  };

  const deleteRole = () => {
    inquirer
      .prompt([
        {
          name: "position",
          type: "list",
          message: "Which Role would you like to delete?",
          choices: pos,
        },
      ])
      .then(({ position }) => {
        connection.query(
          "DELETE FROM roles WHERE ?",
          {
            title: position,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`\n ${res.affectedRows} Role deletion Successful!\n`);
            initialPrompt();
          }
        );
      });
  };
  
  const deleteDepartment = () => {
    inquirer
      .prompt([
        {
          name: "dept",
          type: "list",
          message: "Which Department would you like to delete?",
          choices: depts,
        },
      ])
      .then(({ dept }) => {
        connection.query(
          "DELETE FROM department WHERE ?",
          {
            names: dept,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`\n ${res.affectedRows} Department deletion Successful!\n`);
            initialPrompt();
          }
        );
      });
  };
