const inquirer = require('inquirer');
const table = require('console.table');
const mysql = require('mysql2');

// Inquirer Prompts
const options = [`View all departments`, `View all roles`, `View all employees`, new inquirer.Separator(), `Add a department`, `Add a role`, `Add an employee`, new inquirer.Separator(), `Update an employee role`, `Update employee managers`, new inquirer.Separator(), `View employees by manager`, `View employees by department`, new inquirer.Separator(), `Delete department`, `Delete role`, `Delete employee`, new inquirer.Separator(), `Quit`, new inquirer.Separator()];

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

const init = async () => {
    let exit = false;
    let tableRender;
    let lineBr = '\n';
    while (!exit) {
        // What would the user like to do?
        const response = await inquirer.prompt({
            type: 'list',
            name: 'whatDo',
            message: 'What would you like to do?',
            choices: options
        });

        switch (response.whatDo) {

            // View all departments
            case `View all departments`:
                database.query('SELECT * FROM department;',(err, data) => {
                    if(err)console.log(err);
                    tableRender = table.getTable(data);
                    console.log(lineBr + tableRender);
                });
            break;

            // View all roles
            case `View all roles`:
                database.query('SELECT * FROM role;',(err, data) => {
                    if(err)console.log(err);
                    tableRender = table.getTable(data);
                    console.log(lineBr + tableRender);
                });
            break;

            // View all employees
            case `View all employees`:
                database.query('SELECT * FROM employee;',(err, data) => {
                    if(err)console.log(err);
                    tableRender = table.getTable(data);
                    console.log(lineBr + tableRender);
                });
            break;

            // Add a department
            case `Add a department`:
                inquirer.prompt({
                    type: 'input',
                    name: 'departmentName',
                    message: 'What would you like to call this department?'
                })
                .then((response) => {
                    database.query('INSERT INTO department (name) VALUES (?)', [response.departmentName], (err, data) => {
                        if(err) console.log(err);
                        console.log(`Added ${response.departmentName} to the database.`);
                    });
                }).catch();
            break;

            // Add a role
            case `Add a role`:
                database.query('SELECT * FROM department',(err, data) => {
                    let departments = Object.values(JSON.parse(JSON.stringify(data)));
                    let departmentChoices = [];
                    departments.forEach(department => {
                        departmentChoices.push(department.name)
                    });
                    departmentChoices.push(.('Add new Department'));
                    const roleQs = [{
                        type: 'input',
                        name: 'roleTitle',
                        message: 'What would you like to call this role?'
                    },
                    {
                        type: 'input',
                        name: 'roleSalary',
                        message: `What is this role's salary?`
                    },
                    {
                        type: 'list',
                        name: 'roleDepartment',
                        message: `What role does this department belong to?`,
                        choices: departmentChoices
                    }]

                    inquirer.prompt(roleQs).then((roleResponse) => {

                        switch (roleResponse.roleDepartment) {

                            case `Add new Department`:
                                inquirer.prompt({
                                    type: 'input',
                                    name: 'departmentName',
                                    message: 'What would you like to call this department?'
                                })
                                .then((response) => {
                                    if (response.departmentName.length > 0) {
                                        database.query('INSERT INTO department (name) VALUES (?)', [response.departmentName], (err, data) => {
                                            if(err) console.log(err);
                                            console.log(lineBr + `Added ${response.departmentName} to the database.`);
                                        });
                                        console.log('Added your new department, adding your new role to this department.');
                                        database.query('SELECT * FROM department WHERE name=?', [response.departmentName], (err, data) => {
                                            let newDept = Object.values(JSON.parse(JSON.stringify(data)));
                                            database.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)',[roleResponse.roleTitle, roleResponse.roleSalary, newDept.id], (err, data) => {
                                                if(err) console.log(err);
                                            });
                                        });
                                    };
                                });
                                break;

                            default:
                                database.query('INSTER INTO role (title, salary, department_id) VALUES (?,?,?)',[roleResponse.roleTitle, roleResponse.roleSalary, roleResponse.roleDepartment], (err, data) => {
                                    if(err) console.log(err);
                                });
                                console.log('Added your role to the database');
                                break;
                        };
                    }).catch();
                });
                break;

            // Add an employee
            case `Add an employee`:
                // Getting data for existing roles
                database.query('SELECT * FROM role',(err, data) => {
                    let roles = Object.values(JSON.parse(JSON.stringify(data)));
                    let roleChoices = [];
                    roles.forEach(role => {
                        roleChoices.push(role.title);
                    });
                    roleChoices.push('Add a new role');
                    database.query('SELECT * FROM employee',(err, data) => {
                        let employeeCurrent = Object.values(JSON.parse(JSON.stringify(data)));
                        let managerChoices = [];
                        employeeCurrent.forEach(employee => {
                            managerChoices.push(employee.name);
                        });
                        managerChoices.push('None');
                        const employeeQs = [
                        {
                            type:'input',
                            name: 'newEmployFirstName',
                            message: `What is the new employee's first name?`
                        },
                        {
                            type:'input',
                            name: 'newEmployLastName',
                            message: `What is the new employee's last name?`
                        },
                        {
                            type: 'list',
                            name: 'newEmployRole',
                            message: `What role would you like to give your new employee?`,
                            choices: roleChoices
                        },
                        {
                            type: 'list',
                            name: 'newEmployManager',
                            message: `Would you like to assign a manager to your new employee?`,
                            choices: managerChoices
                        }];
                        // Asking for employee details....
                        inquirer.prompt(employeeQs)
                        .then((response) => {
                            // If no manager...
                            if (newEmployeManager === 'None'){
                                    newEmployeManager = null;
                            }
                            // What about employee role?
                            switch (response.newEmployRole) {
                                // IF THEY WANT TO MAKE A NEW ROLE
                                case 'Add a new role':
                                    // Gets our query data
                                    database.query('SELECT * FROM department',(err, data) => {
                                        let departments = Object.values(JSON.parse(JSON.stringify(data)));
                                        let departmentChoices = [];
                                        departments.forEach(department => {
                                            departmentChoices.push(department.name)
                                        });
                                        departmentChoices.push(.('Add new Department'));
                                        const roleQs = [{
                                        type: 'input',
                                        name: 'roleTitle',
                                        message: 'What would you like to call this role?'
                                    },
                                    {
                                        type: 'input',
                                        name: 'roleSalary',
                                        message: `What is this role's salary?`
                                    },
                                    {
                                        type: 'list',
                                        name: 'roleDepartment',
                                        message: `What role does this department belong to?`,
                                        choices: departmentChoices
                                        }];
                                        // Asking about the new role...
                                        inquirer.prompt(roleQs).then((roleResponse) => {
                                            // What if you want this to be in a new department?
                                            switch (roleResponse.roleDepartment) {
                                                // IF THEY WANT TO MAKE A NEW DEPARTMENT
                                                case `Add new Department`:
                                                    inquirer.prompt({
                                                        type: 'input',
                                                        name: 'departmentName',
                                                        message: 'What would you like to call this department?'
                                                    })
                                                    .then((response) => {
                                                        if (response.departmentName.length > 0) {
                                                            database.query('INSERT INTO department (name) VALUES (?)', [response.departmentName], (err, data) => {
                                                                if(err) console.log(err);
                                                                console.log(lineBr + `Added ${response.departmentName} to the database.`);
                                                            });
                                                            console.log('Added your new department, adding your new role to this department.');
                                                            database.query('SELECT * FROM department WHERE name=?', [response.departmentName], (err, data) => {
                                                                let newDept = Object.values(JSON.parse(JSON.stringify(data)));
                                                                database.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)',[roleResponse.roleTitle, roleResponse.roleSalary, newDept.id], (err, data) => {
                                                                    if(err) console.log(err);
                                                                });
                                                            });
                                                        };
                                                    });
                                                    break;
                                                // IF THEY PICKED AN EXISTING DEPARTMENT
                                                default:
                                                    database.query('INSTER INTO role (title, salary, department_id) VALUES (?,?,?)',[roleResponse.roleTitle, roleResponse.roleSalary, roleResponse.roleDepartment], (err, data) => {
                                                        if(err) console.log(err);
                                                        console.log('Added your role to the database');
                                                    });
                                                    break;
                                            };
                                        });
                                    });
                                    break;

                                // IF THEY PICKED AN EXISTING ROLE
                                default:
                                    let newEmployeManagerID;
                                    for (let i = 0; i < employeeCurrent.length; i++) {
                                        if (newEmployeManager === employeeCurrent[i].name) {
                                            newEmployeManagerID = employeeCurrent[i].id
                                        };
                                    };     
                                    let newEmployRoleID;
                                    for (let i = 0; i < roles.length; i++) {
                                        if (newEmployeRole === roles[i].title) {
                                            newEmployeeRoleID = roles[i].id;
                                        };
                                    };     
                                    database.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',[newEmployFirstName,newEmployLastName,newEmployRoleID,newEmployeManagerID], (err, data) => {
                                        if(err) console.log(err);
                                        console.log('Added your new Employee to the database');
                                    });
                                    break;
                            };
                        }).catch();
                    });
                });
                break;
                
            // Update an employee role
            case `Update an employee role`:
                database.query('SELECT * FROM employee;',(err, data) => {
                    const listofEmploy = Object.values(JSON.parse(JSON.stringify(data)));
                    let currentEmploys = [];
                    listofEmploy.forEach(employee => {
                        currentEmploys.push(employee.name);
                    });

                    database.query('SELECT * FROM role',(err, data) => {
                        const listofRoles = Object.values(JSON.parse(JSON.stringify(data)));
                        let currentRoles = [];
                        listofRoles.forEach(role => {
                            currentRoles.push(role.title);
                        })
                        currentRoles.push(`Add a new role`);
                        inquirer.prompt({
                            type: 'list',
                            name: 'employeeToUpdate',
                            message: `Which employee's role would you like to update?`,
                            choices: currentEmploys
                        },
                        {
                            type:'list',
                            name: 'updatedRole',
                            message: `Which role would you like to replace the employee's existing role with?`,
                            choices: currentRoles
                        })
                        .then((response) => {
                            switch (response.updatedRole) {

                                // USER CHOSE TO ADD A NEW ROLE
                                case `Add a new role`:
                                    database.query('SELECT * FROM department',(err, data) => {
                                        let departments = Object.values(JSON.parse(JSON.stringify(data)));
                                        let departmentChoices = [];
                                        departments.forEach(department => {
                                            departmentChoices.push(department.name)
                                        });
                                        departmentChoices.push('Add new Department');
                                        const roleQs = [{
                                            type: 'input',
                                            name: 'roleTitle',
                                            message: 'What would you like to call this role?'
                                        },
                                        {
                                            type: 'input',
                                            name: 'roleSalary',
                                            message: `What is this role's salary?`
                                        },
                                        {
                                            type: 'list',
                                            name: 'roleDepartment',
                                            message: `What role does this department belong to?`,
                                            choices: departmentChoices
                                        }];
                                        inquirer.prompt(roleQs).then((roleResponse) => {
                                            switch (roleResponse.roleDepartment) {
                                                case `Add new Department`:
                                                    inquirer.prompt({
                                                        type: 'input',
                                                        name: 'departmentName',
                                                        message: 'What would you like to call this department?'
                                                    })
                                                    .then((response) => {
                                                        if (response.departmentName.length > 0) {
                                                            database.query('INSERT INTO department (name) VALUES (?)', [response.departmentName], (err, data) => {
                                                                if(err) console.log(err);
                                                                console.log(lineBr + `Added ${response.departmentName} to the database.`);
                                                            });
                                                            console.log('Added your new department, adding your new role to this department.');
                                                            database.query('SELECT * FROM department WHERE name=?', [response.departmentName], (err, data) => {
                                                                let newDept = Object.values(JSON.parse(JSON.stringify(data)));
                                                                database.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)',[roleResponse.roleTitle, roleResponse.roleSalary, newDept.id], (err, data) => {
                                                                    if(err) console.log(err);
                                                                });
                                                            });
                                                        };
                                                    });
                                                    break;

                                            default:
                                                database.query('INSTER INTO role (title, salary, department_id) VALUES (?,?,?)',[roleResponse.roleTitle, roleResponse.roleSalary, roleResponse.roleDepartment], (err, data) => {
                                                    if(err) console.log(err);
                                                });
                                                console.log('Added your role to the database');
                                                break;
                                            };
                                        });
                                    });
                                    break;

                                // USER CHOSE AN EXISITNG ROLE
                                default:
                                    let updatedRoleID;
                                    for (let i = 0; i < listofRoles.length; i++) {
                                        if (updatedRole === listofRoles[i].title) {
                                            updatedRoleID = listofRoles[i].id;
                                        };
                                    };
                                    database.query('UPDATE employee SET role_id=? WHERE name=?', [updatedRoleID, employeeToUpdate], (err, data) => {
                                        if(err) console.log(err);
                                    });
                                    break;
                            }
                        }).catch();

                    });
                });
                break;

            // TODO: Update employee managers
            case `Update employee managers`:
                
                exit = false;
                break;
            // View employees by manager
            case `View employees by manager`:
                database.query('SELECT * FROM employee WHERE manager_id IS NULL;',(err, data) => {
                    const existingManagers = Object.values(JSON.parse(JSON.stringify(data)));
                    let managers = [];
                    existingManagers.forEach(manager => {
                        managers.push(manager.name);
                    });
                    inquirer.prompt({
                        type: 'list',
                        name: 'managerSelect',
                        message: `Which manager's employees would you like to view?`,
                        choices: managers
                    }).then((response)=> {
                        let managerSelectID;
                        existingManagers.forEach(manager => {
                            if (response.managerSelect === manager.name) {
                                managerSelectID = manager.id;
                            }
                        });
                        database.query('SELECT * FROM employee WHERE manager_id=?',[managerSelectID], (err, data) => {
                            if(err) console.log(err);
                            let tableRender = table.getTable(data);
                            console.log(`${managerSelect}'s Employees`);
                            console.log(tableRender);
                        });
                    }).catch();
                });
                break;

            // View employees by department
            case `View employees by department`:
                database.query('SELECT * FROM department;',(err, data) => {
                    const currentDeparts = Object.values(JSON.parse(JSON.stringify(data)));
                    let departments = [];
                    currentDeparts.forEach(department => {
                        departments.push(department.name);
                    });
                    inquirer.prompt({
                        type: 'list',
                        name: 'departmentSelect',
                        message: `Which department's employees would you like to view?`,
                        choices: departments
                    }).then((response)=> {
                        let departmentSelectID;
                        currentDeparts.forEach(department => {
                            if (department.name === response.departmentSelect) {
                                departmentSelectID = department.id;
                            }
                        });
                        database.query('SELECT * FROM role WHERE department_id=?',[departmentSelectID],(err, data) => {
                            const rolesCurrent = Object.values(JSON.parse(JSON.stringify(data)));
                            let roleIDArr = [];
                            rolesCurrent.forEach(roles => {
                                roleIDArr.push(roles.id);
                            });
                            database.query('SELECT * FROM employee WHERE role_id=?', roleIDArr, (err, data) => {
                                tableRender = table.getTable(data);
                                console.log(lineBr + tableRender); 
                            });
                        });
                    }).catch();
                });
                break;

            // Delete department
            case `Delete department`:
                database.query('SELECT * FROM department',(err, data) => {
                    if(err) console.log(err);
                    const currentDepartments = Object.values(JSON.parse(JSON.stringify(data)));
                    const departments = [];
                    currentDepartments.forEach(department => {
                        departments.push(department.name);
                    });
                    inquirer.prompt({
                        type: 'list',
                        name: 'departmentToDelete',
                        message: `Which department would you like to delete?`,
                        choices: departments
                    })
                    .then((response) => {
                        database.query('DELETE FROM department WHERE name=?',[response.departmentToDelete], (err, data) => {
                            if(err) console.log(err);
                        });
                        console.log(`Deleted ${response.departmentToDelete} from the database.`);
                    }).catch();
                });
                break;

            // Delete role
            case `Delete role`:
                database.query('SELECT * FROM role;',(err, data) => {
                    const currentRoles = Object.values(JSON.parse(JSON.stringify(data)));
                    let roles = [];
                    currentRoles.forEach(role => {
                        roles.push(role.title);
                    });
                    inquirer.prompt({
                        type: 'list',
                        name: 'roleToDelete',
                        message: `Which role would you like to delete?`,
                        choices: roles
                    }).then((response) => {
                        let roleToDeleteID;
                        currentRoles.forEach(role => {
                            if(role.title === response.roleToDelete) {
                                roleToDeleteID = role.id;
                            }
                        });
                        database.query('DELETE FROM role WHERE id=?',[roleToDeleteID], (err, data) => {
                            if(err) console.log(err);
                            console.log('Deleted the selected role from the database')
                        });
                    }).catch();
                });
                exit = false;
                break;

            // Delete employee
            case `Delete employee`:
                database.query('SELECT * FROM employee;',(err, data) => {
                    const currentEmployees = Object.values(JSON.parse(JSON.stringify(data)));
                    let employees = [];
                    currentEmployees.forEach(employee => {
                        employees.push(employee.first_name + employee.last_name);
                    });
                    inquirer.prompt({
                    type: 'list',
                    name: 'employToDelete',
                    message: `Which employee would you like to delete?`,
                    choices: employees
                    }).then((response) => {
                        let employeeToDeleteID;
                        currentEmployees.forEach(employee => {
                        if (response.employToDelete === (employee.first_name + employee.last_name)) {
                            employeeToDeleteID = employee.id;
                        }
                        });
                        database.query('DELETE FROM employee WHERE id=?',[employeeToDeleteID],(err, data) => {
                        if(err) console.log(err);
                        console.log('Employee deleted from database');
                        });
                    }).catch();
                });
                break;

            // Quit
            case `Quit`:
                exit = true;
                console.log('Goodbye!');
            break;
        };
    };
};

init();