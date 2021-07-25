const mysql = require('mysql2');
const inquirer = require('inquirer');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

const updateAnEmployeeRole = async () => {
    const [employeeRows, employeeFields] = await database.promise().query('SELECT * FROM employee');
    const listofEmploy = Object.values(JSON.parse(JSON.stringify(employeeRows)));


    let currentEmploys = [];
        listofEmploy.forEach(employee => {
            currentEmploys.push(employee.name);
        });

    const [roleRows, roleFields] = await database.promise().query('SELECT * FROM role');
    const listofRoles = Object.values(JSON.parse(JSON.stringify(roleRows)));

    let currentRoles = [];
        listofRoles.forEach(role => {
            currentRoles.push(role.title);
        })
        currentRoles.push(chalk.cyan(`Add a new role`));

    const { employeeToUpdate, updatedRole } = await inquirer.prompt({
            type: 'list',
            name: 'employeeToUpdate',
            message: `Which employee's role would you like to update?`,
            choices: currentEmploys
    },{
            type:'list',
            name: 'updatedRole',
            message: `Which role would you like to replace the employee's existing role with?`,
            choices: currentRoles
    })

    switch (updatedRole) {

        case chalk.cyan(`Add a new role`):
            let [rows, fields] = await database.promise().query('SELECT * FROM department');
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
                        const [departmentWhereRows, departmentWhereFields] = await database.promise().query('SELECT * FROM department WHERE name=?', [departmentName]);

                        let newDept = Object.values(JSON.parse(JSON.stringify(departmentWhereRows)));
                        // Adds role finally, with new departments ID
                        database.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)',[roleTitle, roleSalary, newDept[0].id]);

                        const [roleRows, roleRields] = await database.promise().query('SELECT * FROM role');
                        const listofRoles = Object.values(JSON.parse(JSON.stringify(roleRows)));

                        let updatedRoleID;
                            listofRoles.forEach(role => {
                                if(roleTitle === role.title) {
                                    updatedRoleID = role.id;
                                }
                            });

                        database.query('UPDATE employee SET role_id=? WHERE name=?', [updatedRoleID, employeeToUpdate])

                        log(chalk.yellowBright('Updated your employee with their new role'))

                            break;

                    default:

                        database.query('INSTER INTO role (title, salary, department_id) VALUES (?,?,?)'[roleTitle, roleSalary, roleDepartment]);

                        console.log(chalk.yellowBright('Added your role to the database'));

                        // Getting new list of roles
                        const [rows, fields] = await database.promise.query('SELECT * FROM role');
                        const newRolesList = Object.values(JSON.parse(JSON.stringify(rows)));

                        newRolesList.forEach(role => {
                            if (role.title === roleTitle) {
                                updatedRoleID = role.id
                            }
                        });

                        // Setting updated role ID to be newly created role
                        database.query('UPDATE employee SET role_id=? WHERE name=?', [updatedRoleID, employeeToUpdate])

                        console.log(chalk.yellowBright('Updated your employee with their new role'));

                            break;
                }
                        
            break;
                
        default:
            // Chose an existing role, adding roleID and Employee name to query
            let updatedRoleID;
            for (let i = 0; i < listofRoles.length; i++) {
                if (updatedRole === listofRoles[i].title) {
                        updatedRoleID = listofRoles[i].id;
                }
            }

            database.query('UPDATE employee SET role_id=? WHERE name=?', [updatedRoleID, employeeToUpdate])
                break;
    }
}

module.exports = updateAnEmployeeRole;