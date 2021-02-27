DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(35) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY (id)
);

SELECT * FROM employeeDB.department;
INSERT INTO department (name)
VALUES ("Marketing"),
("Human Resources"),
("Customer Service"),
("Public Relations"),
("Content Creation");

SELECT * FROM employeeDB.role;
INSERT INTO role (title, salary, department_id)
VALUES ("Sr. Marketing Specialist", 75000, 1),
("Jr. Marketing Specialist", 65000, 1),
("Marketing Assistant", 50000, 1),
("HR Senior", 60000, 2),
("HR Junior", 50000, 2),
("Customer Service Representative", 45000, 3),
("Public Relations Specialist", 70000, 4),
("Content Manager", 75000, 5),
("Videographer", 55000, 5),
("Video Editor", 55000, 5),
("Photographer", 55000, 5),
("Set Designer", 60000, 5),
("Wardrobe Specialist", 60000, 5);

SELECT * FROM employeeDB.employee;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jackie", "Aina", 4, NULL),
("Raven", "Elyse", 5, 1),
("Tia", "Zamara", 1, NULL),
("Allyiah", "Face", 8, NULL),
("Simply", "Tonia", 13, 4),
("Danny", "McGee", 9, 4),
("Arnell", "Armon", 2, 3),
("Alissa", "Ashley", 11, 4),
("Lydia", "Dinga", 12, 4),
("Teaira", "Walker", 3, 3),
("Jennelle", "Eliana", 10, 4),
("Jarvis", "Johnson", 6, 1),
("Shelah", "Marie", 7, 1);