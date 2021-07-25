const inquirer = require('inquirer');
const mysql = require('mysql2');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

const addARole = async () => {
    // Gets our query data
    const [rows, fields] = await database.promise().query('SELECT * FROM department');
    // Converts our rows from weird format to useable format
    let departments = Object.values(JSON.parse(JSON.stringify(rows)));
    // Setting up for our inquirer
    let departmentChoices = [];
    // Putting db values into inquirerarr
    departments.forEach(department => {
        departmentChoices.push(department.name)
    });
    // Adding our weird string
    departmentChoices.push(chalk.cyan('Add new Department'));

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
        choices: departmentChoices
    }]

    const { roleTitle , roleSalary, roleDepartment } = await inquirer.prompt(roleQs);

    switch (roleDepartment) {

        case chalk.cyan(`Add new Department`):
            // Takes new department name
            const { departmentName } = await inquirer.prompt({
                type: 'input',
                name: 'departmentName',
                message: 'What would you like to call your new department?'
            })
            // Adds department
            database.query('INSERT INTO department (name) VALUES (?)', [departmentName], (err, result, fields) => {
                console.log(chalk.yellowBright('Added your new department, adding your new role to this department.'));
            })

            // Assign newDeptID from returned array of current departments
            const [rows, fields] = await database.promise().query('SELECT * FROM department WHERE name=?', [departmentName]);

            let newDept = Object.values(JSON.parse(JSON.stringify(rows)));
            // Adds role finally, with new departments ID
            database.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)',[roleTitle, roleSalary, newDept[0].id]);

            break;

        default:

            database.query('INSTER INTO role (title, salary, department_id) VALUES (?,?,?)'[roleTitle, roleSalary, roleDepartment]);
            console.log(chalk.yellowBright('Added your role to the database'));
            break;
 }
}

module.exports = addARole;