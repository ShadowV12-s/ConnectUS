const sqlite3 = require('sqlite3').verbose();

// Replace 'your-database-file.db' with the actual path to your SQLite database file
const db = new sqlite3.Database('data/test.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database.');
  }
});

module.exports = db;



