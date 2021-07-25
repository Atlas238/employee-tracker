const mysql = require('mysql2');
const inquirer = require('inquirer');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

const deleteDepartment = async () => {

    const [rows, fields] = await database.promise().query('SELECT * FROM department');
    const currentDepartments = Object.values(JSON.parse(JSON.stringify(rows)));

    const departments = [];
    currentDepartments.forEach(department => {
        departments.push(department.name);
    });

    const { departmentToDelete } = await inquirer.prompt({
        type: 'list',
       name: 'departmentToDelete',
       message: `Which department would you like to delete?`,
       choices: departments
   });

   database.query('DELETE FROM department WHERE name=?',[departmentToDelete], (err, result, fields) => {
       if(err) console.log(err);
       console.log(`Deleted ${departmentToDelete} from the database.`);
   });
}

module.exports = deleteDepartment;