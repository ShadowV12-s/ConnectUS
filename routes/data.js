const sqlite3 = require('sqlite3').verbose();

async function getservices() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('data/test.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err);
      }
    });

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
  });
}

module.exports = {
  getservices: getservices,
};
