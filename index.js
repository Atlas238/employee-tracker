const inquirer = require('inquirer');
const chalk = require('chalk');
const viewAllDepartments = require('./js/viewAllDepartments');
const viewAllRoles = require('./js/viewAllRoles');
const viewAllEmployees = require('./js/viewAllEmployees');
const addADepartment = require('./js/addADepartment');
const addARole = require('./js/addARole');
const addAnEmployee = require('./js/addAnEmployee');
const updateAnEmployeerole = require('./js/updateAnEmployeeRole');
const viewEmployeesByManager = require('./js/viewEmployeesByManager');
const viewEmployeesByDepartment = require('./js/viewEmployeesByDepartment');
const deleteDepartment = require('./js/deleteDepartment');
const deleteRole = require('./js/deleteRole');
const deleteEmployees = require('./js/deleteEmployees');


// MySql Connection


// Chalk styles...

// Inquirer Prompts

const options = [chalk.cyan(`View all departments`), chalk.cyan(`View all roles`), chalk.cyan(`View all employees`), new inquirer.Separator(), chalk.cyan(`Add a department`), chalk.cyan(`Add a role`), chalk.cyan(`Add an employee`), new inquirer.Separator(), chalk.cyan(`Update an employee role`), chalk.cyan(`Update employee managers`), new inquirer.Separator(), chalk.cyan(`View employees by manager`), chalk.cyan(`View employees by department`), new inquirer.Separator(), chalk.cyan(`Delete department(s)`), chalk.cyan(`Delete role`), chalk.cyan(`Delete employee(s)`), chalk.cyan(`View the total utilized budget of a department (Sum of employee salaries)`), new inquirer.Separator(), chalk.cyan(`Quit`), new inquirer.Separator()];

const init = async () => {
    let exit = false;

    while (!exit) {
        // What would the user like to do?
        const response = await inquirer.prompt({
            type: 'list',
            name: 'whatDo',
            message: 'What would you like to do?',
            choices: options
        });
        // Handle responses in outside js files
        switch (response.whatDo) {
            // View all departments
            // TODO: TEST
            case chalk.cyan(`View all departments`):
                viewAllDepartments();
            break;
            // View all roles
            // TODO: TEST
            case chalk.cyan(`View all roles`):
                viewAllRoles(); 
            break;
            // View all employees
            // TODO: TEST
            case chalk.cyan(`View all employees`):
                viewAllEmployees();
            break;
            // Add a department
            // TODO: TEST
            case chalk.cyan(`Add a department`):
                addADepartment();
            break;
            // Add a role
            // TODO: TEST
            case chalk.cyan(`Add a role`):
                addARole();
                break;
            // Add an employee
            // TODO: TEST
            case chalk.cyan(`Add an employee`):
                addAnEmployee();
                break;
            // Update an employee role
            // TODO: TEST
            case chalk.cyan(`Update an employee role`):
                updateAnEmployeerole();
                break;
            // TODO: Update employee managers
            case chalk.cyan(`Update employee managers`):
            
                break;
            // View employees by manager
            // TODO: TEST
            case chalk.cyan(`View employees by manager`):
                // TODO: FIX THIS FILE VIEWEMPLOYEESBYMANAGER.JS
                viewEmployeesByManager();
                break;

            // View employees by department
            // TODO: TEST
            case chalk.cyan(`View employees by department`):
                viewEmployeesByDepartment(); 
                break;

            // Delete department(s)
            // TODO: TEST
            case chalk.cyan(`Delete department(s)`):
                deleteDepartment();
                break;

            // Delete role
            // TODO: TEST CURRENTLY FLOWING INTO OTHER DELETE QUERIES?

            case chalk.cyan(`Delete role`):
                deleteRoles();
                break;

            // Delete employee(s)
            case chalk.cyan(`Delete employee(s)`):
                deleteEmployees();
                break;

            // View the total utilized budget of a department (Sum of employee salaries)
            // TODO: MODULARIZE FOLLOWING FUNCTION
            case chalk.cyan(`View the total utilized budget of a department (Sum of employee salaries)`):

                // const [departmentsRows,fields] = await database.promise().query('SELECT * FROM department');
                // const existingDepartments = Object.values(JSON.parse(JSON.stringify(departmentsRows)));

                // let departmentChoices = [];
                // existingDepartments.forEach(department => {
                //     departmentChoices.push(department.name); 
                // });

                // // Ask which department
                // const { departmentSelected } = await inquirer.prompt({
                //     type: 'list',
                //     name: 'departmentSelected',
                //     message: 'Which department would you like to view the budged utilization of?',
                //     choices: departmentChoices
                // })

                // let departmentPickedID;
                //     existingDepartments.forEach(department => {
                //         if (departmentSelected === department.name) {
                //             departmentPickedID = department.id;
                //         }
                //     });

                // const [sumSalaryRows, sumSalaryFields] = await database.promise().query('SELECT SUM(salary) FROM role WHERE department_id=?', [departmentPickedID]);
                // // Render results
                // tableRender = table.getTable(sumSalaryRows);
                // console.log(lineBr + tableRender + lineBr);
            break;

            // Quit
            case chalk.cyan(`Quit`):
                exit = true;
                console.log(chalk.yellow('Goodbye!'));
            break;
        };

    };
};

init();
