const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

const viewEmployeesByDepartment = async () => {
    
    let lineBr = '\n'
    let tableRender;

    const [departmentRows, departmentFields] = await database.promise().query('SELECT * FROM department');
    const currentDeparts = Object.values(JSON.parse(JSON.stringify(departmentRows)));

    let departments = [];
    currentDeparts.forEach(department => {
        departments.push(department.name);
    });

    const { departmentSelect } = await inquirer.prompt({
        type: 'list',
        name: 'departmentSelect',
        message: `Which department's employees would you like to view?`,
        choices: departments
    });

    let departmentSelectID;
    currentDeparts.forEach(department => {
        if (department.name === departmentSelect) {
            departmentSelectID = department.id;
        }
    });

    const [rows, fields] = await database.promise().query('SELECT * FROM employee WHERE department_id=?',[departmentSelectID]);

    tableRender = table.getTable(rows);

    log(lineBr + tableRender + lineBr);
}

module.exports = viewEmployeesByDepartment;