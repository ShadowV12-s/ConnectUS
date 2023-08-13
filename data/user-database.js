// data/user-database.js

const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite3 database
const db = new sqlite3.Database('./data/mydatabase.db', (error) => {
  if (error) {
    console.error('Database connection error:', error);
  } else {
    console.log('Connected to the database.');

    // Create the users table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        googleId TEXT,
        email TEXT,
        name TEXT,
        picture TEXT
      )
    `);
  }
});
// Function to insert a new user
function insertUser(googleId, email, name, picture) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (googleId, email, name, picture) VALUES (?, ?, ?, ?)`,
      [googleId, email, name, picture],
      (err) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.log('New user inserted into the database.');
        resolve();
      }
    );
  });
}

// Function to retrieve user by Google ID
function getUserByGoogleId(googleId) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE googleId = ?`, [googleId], (err, row) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve(row);
    });
  });
}

module.exports = {
  insertUser,
  getUserByGoogleId
};
