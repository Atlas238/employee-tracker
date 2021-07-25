const mysql = require('mysql2');
const inquirer = require('inquirer');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

const viewEmployeesByManager = async () => {

    const [employeeWhereRows, employeeWhereFields] = await database.promise().query('SELECT * FROM employee WHERE manager_id=NOTNULL')
    const existingManagers = Object.values(JSON.parse(JSON.stringify(employeeWhereRows)));

    let managers = [];
    existingManagers.forEach(manager => {
        managers.push(manager.name);
    });

    const { managerSelect } = await inquirer.prompt({
        type: 'list',
        name: 'managerSelect',
        message: `Which manager's employees would you like to view?`,
        choices: managers
    })

            // TODO:
}


module.exports = viewEmployeesByManager;