USE employee_tracker_db;

INSERT INTO department (name) 
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal'),
('Marketing');

INSERT INTO role (title, salary, department_id) 
VALUES 
('Salesperson', 1000, 1),
('Lead Engineer', 1800, 2),
('Software Engineer', 1000, 2),
('Account Manager', 1400, 3),
('Legal Team Lead', 2000, 4),
('Lawyer', 1700, 4),
('Marketing Lead', 1800, 5),
('Marketing Assistant', 1000, 5);

INSERT INTO employee (first_name, last_name, role_id) 
VALUES
('John', 'Doe', 1),
('James', 'Dough', 2),
('Jane', 'Dew', 3),
('Winny', 'Smith', 4),
('Michael', 'Scott', 5),
('Bobby', 'Blunder', 6),
('Brandy', 'Bubbles', 7),
('Billy', 'Batson', 8);