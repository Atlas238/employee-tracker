const table = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');


const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

const addADepartment = async () => {

    let lineBr = '\n';
    let tableRender;

    const { departmentName } = await inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'What would you like to call this department?'
    })

    database.query('INSERT INTO department (name) VALUES (?)', [departmentName], (err, response, fields) => {
        if(err){ console.loglog(err) };
        console.log(lineBr + `Added ${departmentName} to the database.`);
    });

    database.query('SELECT * FROM department', (err, response, fields) => {
        tableRender = table.getTable(response);
        console.log(lineBr + tableRender + lineBr);
    })
}

module.exports = addADepartment;