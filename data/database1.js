

// database1.js
const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('your-database-file.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

function getUserDataByEmail(email, callback) {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.get(query, [email], (err, row) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, row); // Pass null for the error and the row object containing user data
  });
}

module.exports = {
  getUserDataByEmail,
};
