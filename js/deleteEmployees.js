const mysql = require('mysql2');
const inquirer = require('inquirer');
const chalk = require('chalk');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

const deleteEmployees = async () => {

    const [rows, fields] = await database.promise().query('SELECT * FROM employee');
    const currentEmployees = Object.values(JSON.parse(JSON.stringify(rows)));

    let employees = [];
        currentEmployees.forEach(employee => {
            employees.push(employee.first_name + employee.last_name);
        });

    // Pull employees from mysql
    const { employToDelete } = await inquirer.prompt({
        type: 'list',
        name: 'employToDelete',
        message: `Which employee would you like to delete?`,
        choices: employees
    })

    let employeeToDeleteID;
    currentEmployees.forEach(employee => {
        if (employToDelete === (employee.first_name + employee.last_name)) {
            employeeToDeleteID = employee.id;
        }
    });

    database.query('DELETE FROM employee WHERE id=?'[employeeToDeleteID])
    console.log(chalk.yellowBright('Employee deleted from database'));
}

module.exports = deleteEmployees;