const sqlite3 = require('sqlite3').verbose();

async function getservices() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('data/test.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err);
      } else {
        // Query the data
        const sql = `SELECT * FROM service`;
        db.all(sql, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });

        // Close the database connection
        db.close();
      }
    });
  });
} 

// Function to insert data into the "service" table
function insertService(values) {
  const db = new sqlite3.Database('data/test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      const sql = `INSERT INTO service(service_name, service_description, time_date, amount_of_hours, location, contacts) VALUES (?, ?, ?, ?, ?, ?)`;
      db.run(sql, values, (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Data inserted successfully.');
        }
        db.close();
      });
    }
  });
}

module.exports = {
  getservices: getservices,
  insertService: insertService,
};
