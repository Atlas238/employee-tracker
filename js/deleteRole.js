const mysql = require('mysql2');
const inquirer = require('inquirer');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

const deleteRole = async () => {
    // Get data and tranform
    const [rows, fields] = await database.promise().query('SELECT * FROM role');
    const currentRoles = Object.values(JSON.parse(JSON.stringify(rows)));
    // Add to choices
    let roles = [];
    currentRoles.forEach(role => {
        roles.push(role.title);
    });

    const { roleToDelete } = await inquirer.prompt({
        type: 'list',
        name: 'roleToDelete',
        message: `Which role would you like to delete?`,
        choices: roles
    });

    let roleToDeleteID;
    currentRoles.forEach(role => {
        if(role.title === roleToDelete) {
            roleToDeleteID = role.id;
        }
    });

    database.query('DELETE FROM role WHERE id=?'[roleToDeleteID]);

    console.log(chalk.yellowBright('Deleted the selected role from the database'))
}

module.exports = deleteRole;