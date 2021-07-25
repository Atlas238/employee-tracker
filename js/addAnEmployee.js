const mysql = require('mysql2');
const inquirer = require('inquirer');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

const addAnEmployee = async () => {
    // Getting data for existing roles
    const [ roletextRows, rolefields ] = await database.query('SELECT * FROM role');
    let roles = Object.values(JSON.parse(JSON.stringify(textRows)));

    let roleChoices = [];
    roles.forEach(role => {
        roleChoices.push(role.title);
    });
    roleChoices.push(chalk.cyan('Add a new role'));

    // Getting data for existing employees to create manager choices
    const [employeetextRows, employeefields] = await database.query('SELECT * FROM employee');
    let employeeCurrent = Object.values(JSON.parse(JSON.stringify(employeetextRows)));

    let managerChoices = [];
    employeeCurrent.forEach(employee => {
        managerChoices.push(employee.name);
    });
    // Im just not gonna let you make a new employee instead of picking an existing one to be a new employee's manager...
    managerChoices.push(chalk.cyan('None'));

    const employeeQs = [
        {
            type:'input',
            name: 'newEmployFirstName',
            message: `What is the new employee's first name?`
        },{
            type:'input',
            name: 'newEmployLastName',
            message: `What is the new employee's last name?`
        },{
            type: 'list',
            name: 'newEmployRole',
            message: `What role would you like to give your new employee?`,
            choices: roleChoices
        },{
            type: 'list',
            name: 'newEmployManager',
            message: `Would you like to assign a manager to your new employee?`,
            choices: managerChoices
        }]
        // Now have inputs...
    const { newEmployFirstName, newEmployLastName, newEmployRole, newEmployeManager } = await inquirer.prompt(employeeQs)

        if (newEmployeManager === chalk.cyan('None')){
            newEmployeManager = null;
        }
        // If they wanted to make a NEW ROLE
    switch (newEmployRole) {

        case chalk.cyan('Add a new role'):
            // Gets our query data
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
                    // User chose to add a new department
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

                        const [roleWhereNameRows, roleWhereNamefields] = await database.promise().query('SELECT * FROM role WHERE name=?',[roleTitle]);
                        let newRole = Object.values(JSON.parse(JSON.stringify(roleWhereNameRows)));
                        let newRoleId = newRole[0].id
                        // Assigns new role to new employee and generates
                        database.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',[newEmployFirstName,newEmployLastName,newRoleId,newEmployeManager])

                        break;
                
                    // User selected existing department
                    default:
                        database.query('INSTER INTO role (title, salary, department_id) VALUES (?,?,?)'[roleTitle, roleSalary, roleDepartment]);
                        console.log(chalk.yellowBright('Added your role to the database'));
                        break;
                }

                break;
            
        // IF THEY PICKED AN EXISTING ROLE
        default:

            let newEmployeManagerID;
            for (let i = 0; i < employeeCurrent.length; i++) {
                if (newEmployeManager === employeeCurrent[i].name) {
                    newEmployeManagerID = employeeCurrent[i].id
                }
            }

            let newEmployRoleID;
            for (let i = 0; i < roles.length; i++) {
                if (newEmployeRole === roles[i].title) {
                    newEmployeeRoleID = roles[i].id;
                }
            }

            database.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',[newEmployFirstName,newEmployLastName,newEmployRoleID,newEmployeManagerID]);
            console.log(chalk.yellow('Added your new Employee to the database'))
            break;
    }
}

module.exports = addAnEmployee;