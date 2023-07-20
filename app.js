const sqlite3 = require("sqlite3").verbose();
let sql;

// connect to DB
const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// Create table
// sql = `CREATE TABLE users(id INTEGER PRIMARY KEY, first_name, last_name, username, password, email)`;
// db.run(sql);

// Drop table
// db.run("DROP TABLE users");

// Insert data into table
// sql = `INSERT INTO users(first_name, last_name, username, password, email) VALUES (?,?,?,?,?)`;
// db.run(
//     sql,
//     ["Yu", "Huang", "Huang_user", "test", "Yu@gmail.com"],
//     (err) => {
//         if (err) return console.error(err.message);
//     }
// );

// Update data
// sql = `UPDATE users SET first_name = ? WHERE id = ?`;
// db.run(sql, ['Jake', 1], (err) => {
//     if (err) return console.error(err.message);
// });

//delete data
// sql = `DELETE FROM users WHERE id = ?`;
// db.run(sql, [3], (err) => {
//     if (err) return console.error(err.message);
// });

// // Query the data
// sql = `SELECT * FROM users`;
// db.all(sql, [], (err, rows) => {
//     if (err) return console.error(err.message);
//     rows.forEach((row) => {
//         console.log(row);
//     });
// });




//
//
//Service table

// Create table
// sql = `CREATE TABLE service(id INTEGER PRIMARY KEY, service_name TEXT, service_description TEXT, time_date DATETIME, amount_of_hours INTEGER, location TEXT, contacts TEXT)`;
// db.run(sql);


// Drop table
// db.run("DROP TABLE service");

// Insert data into table
sql = `INSERT INTO service(service_name, service_description, time_date, amount_of_hours, location, contacts) VALUES (?, ?, ?, ?, ?, ?)`;
const values = ["Helping Hand", "Helping the homeless shelter", "January  19, 2023 @ 7:00am", "2", "1234 homeless street", "Hand@example.com"];

db.run(sql, values, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Data inserted successfully.");
    }
});

// Update data
// sql = `UPDATE service SET first_name = ? WHERE id = ?`;
// db.run(sql, ['Jake', 1], (err) => {
//     if (err) return console.error(err.message);
// });

//delete data
// sql = `DELETE FROM service WHERE id = ?`;
// db.run(sql, [3], (err) => {
//     if (err) return console.error(err.message);
// });

// // Query the data
// sql = `SELECT * FROM service`;
// db.all(sql, [], (err, rows) => {
//     if (err) return console.error(err.message);
//     rows.forEach((row) => {
//         console.log(row);
//     });
// });