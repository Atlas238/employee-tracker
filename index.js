const inquirer = require('inquirer');
const mysql = require('mysql2');
const chalk = require('chalk');
const table = require('console.table');
const log = console.log;
const lineBr = '\n';

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

// Chalk styles...

// Inquirer Prompts

const options = [chalk.cyan(`View all departments`), chalk.cyan(`View all roles`), chalk.cyan(`View all employees`), new inquirer.Separator(), chalk.cyan(`Add a department`), chalk.cyan(`Add a role`), chalk.cyan(`Add an employee`), new inquirer.Separator(), chalk.cyan(`Update an employee role`), chalk.cyan(`Update employee managers`), new inquirer.Separator(), chalk.cyan(`View employees by manager`), chalk.cyan(`View employees by department`), new inquirer.Separator(), chalk.cyan(`Delete department(s)`), chalk.cyan(`Delete role(s)`), chalk.cyan(`Delete employee(s)`), chalk.cyan(`View the total utilized budget of a department (Sum of employee salaries)`), new inquirer.Separator(), chalk.cyan(`Quit`), new inquirer.Separator()];

const init = async () => {
    let exit = false;

    while (!exit) {

        const response = await inquirer.prompt({
            type: 'list',
            name: 'whatDo',
            message: 'What would you like to do?',
            choices: options
        });
        
        let tableRender;

        switch (response.whatDo) {
            // View all departments
            case chalk.cyan(`View all departments`):

                    database.promise().query('SELECT * FROM department;')
                    .then( (results) => {
                        tableRender = table.getTable(results[0]);
                        log(lineBr + tableRender + lineBr);
                    })

            break;

            // View all roles
            case chalk.cyan(`View all roles`):
                database.promise().query('SELECT * FROM role;')
                .then((results) => {
                    tableRender = table.getTable(results[0]);
                    log(lineBr + tableRender + lineBr);
                }) 
                
                
            break;

            // View all employees
            case chalk.cyan(`View all employees`):
    
                database.promise().query('SELECT * FROM employee;')
                .then((results) => {
                    tableRender = table.getTable(results[0]);
                    log('\n' + tableRender + '\n');
                })
                
            break;

            // Add a department
            case chalk.cyan(`Add a department`):

                const { departmentName } = await inquirer.prompt({
                    type: 'input',
                    name: 'departmentName',
                    message: 'What would you like to call this department?'
                })

                database.query('INSERT INTO department (name) VALUES (?)', [departmentName], (err, response, fields) => {
                    if(err){ log(err) };
                    log(lineBr + `Added ${departmentName} to the database.`);
                });

                database.query('SELECT * FROM department', (err, response, fields) => {
                    tableRender = table.getTable(response);
                    log(lineBr + tableRender + lineBr);
                })
            
            break;

            // Add a role
            case chalk.cyan(`Add a role`):
                let departments
                database.query('SELECT * FROM department', (err, result, fields) => {
                    if (err) log(err);
                    log(result);
                })

            const roleQs = [{
                type: 'input',
                name: 'roleTitle',
                message: 'What would you like to call this role?'
            },{
                type: 'input',
                name: 'roleSalary',
                message: `What is this role's salary?`
            },{
                type: 'list',
                name: 'roleDepartment',
                message: `What role does this department belong to?`,
                choices: [departments, chalk.cyan('Add new Department')]
            }]

            const { roleTitle , roleSalary, roleDepartment } = await inquirer.prompt(roleQs);

                switch (roleDepartment) {
                    case chalk.cyan(`Add new Department`):
                        const { departmentName } = await inquirer.prompt({
                            type: 'input',
                            name: 'departmentName',
                            message: 'What would you like to call your new department?'
                        })
                        // TODO: Assign newDeptID from returned array of current departments
                        let newdeptId;
                        database.query('INSERT INTO department (name) VALUES (?)', [departmentName], (err, result, fields) => {
                            log(result);
                            if(err) log(err);
                            log('Added your new department, adding your new role to this department.')
                        })

                        database.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)',[roleTitle, roleSalary, ])
                        break;
            
                    default:
                        break;
            }
            
            break;

            // Add an employee
            case chalk.cyan(`Add an employee`):
            
            break;

            // Update an employee role
            case chalk.cyan(`Update an employee role`):
            
            break;

            // Update employee managers
            case chalk.cyan(`Update employee managers`):
            
            break;

            // View employees by manager
            case chalk.cyan(`View employees by manager`):

                let managers = [];
                // TODO: pull current managers from mysql, load into array

                const { managerSelect } = await inquirer.prompt({
                    type: 'list',
                    name: 'managerSelect',
                    message: `Which manager's employees would you like to view?`,
                    choices: managers
                })
            
            break;

            // View employees by department
            case chalk.cyan(`View employees by department`):

                let departments = [];
                // TODO: Pull departments from mysql, load into array

                const { departmentSelect } = await inquirer.prompt({
                    type: 'list',
                    name: 'departmentSelect',
                    message: `Which department's employees would you like to view?`,
                    choices: departments
                });
            
            break;

            // Delete department(s)
            case chalk.cyan(`Delete department(s)`):

                const { departmentToDelete } = await inquirer.prompt({
                    type: 'list',
                    name: 'departmentToDelete',
                    message: `Which department would you like to delete?`,
                    choices: departments
                });

                database.query('DELETE FROM department WHERE name=?'[departmentToDelete], (err, result, fields) => {
                    if(err) log(err);
                    log(`Deleted ${departmentToDelete} from the database.`);
                })

            break;

            // Delete role(s)
            case chalk.cyan(`Delete role(s)`):
                
                let roles = [];
                // TODO: Pull in roles from msyql
                const { roleToDelete } = await inquirer.prompt({
                    type: 'list',
                    name: 'roleToDelete',
                    message: `Which role would you like to delete?`,
                    choices: roles
                })
            
            break;

            // Delete employee(s)
            case chalk.cyan(`Delete employee(s)`):
                
                let employees = [];
                // TODO: Pull employees from mysql
                const { employToDelete } = await inquirer.prompt({
                    type: 'list',
                    name: 'employToDelete',
                    message: `Which employee would you like to delete?`,
                    choices: employees
                })
            
            break;

            // View the total utilized budget of a department (Sum of employee salaries)
            case chalk.cyan(`View the total utilized budget of a department (Sum of employee salaries)`):
            
            break;

            // Quit
            case chalk.cyan(`Quit`):
                exit = true;
                log(chalk.yellow('Goodbye!'));
            break;
        }

    };
}

init();
