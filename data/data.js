const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data/mydatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        serviceName TEXT,
        email TEXT,
        description TEXT,
        date TEXT,
        time TEXT,
        time2 TEXT,
        hours INTEGER,
        address TEXT
      )
    `);
  }
});

// Function to insert service data into the database
function insertService(serviceData) {
  return new Promise((resolve, reject) => {
    const {
      serviceName,
      email,
      description,
      date,
      time,
      time2,
      hours,
      address,
    } = serviceData;

    db.run(
      `INSERT INTO services (serviceName, email, description, date, time, time2, hours, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [serviceName, email, description, date, time, time2, hours, address],
      function (err) {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          console.log(`A new service has been submitted with id ${this.lastID}`);
          resolve(this.lastID);
        }
      }
    );
  });
}


// Function to retrieve services from the database
function getServices() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM services', (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  insertService,
  getServices,
};
