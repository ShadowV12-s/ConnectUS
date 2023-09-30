const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db'); // Replace with your actual database file

const addColumnQuery = `
  ALTER TABLE services
  ADD COLUMN user_id INTEGER;
`;

db.serialize(() => {
  db.run(addColumnQuery, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Column added successfully');
  });
});

db.close();
