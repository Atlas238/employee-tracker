const table = require('console.table');
const mysql = require('mysql2');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

const viewAllDepartments = () => {
    let lineBr = '\n';
    let tableRender;
    database.promise().query('SELECT * FROM department;')
    .then( (results) => {
        tableRender = table.getTable(results[0]);
        console.log(lineBr + tableRender + lineBr);
    })
}

module.exports = viewAllDepartments;