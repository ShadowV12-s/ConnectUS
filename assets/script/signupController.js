const express = require('express');
const bodyParser = require('body-parser');
const db = require('../../data/database');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
 
// Serve the signup page
router.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.ejs'); 
});

// Handle the form submission from the signup page
router.post('/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
 
  // Perform validation on the form data (you can add more validation as needed)
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send('All fields are required.');
  }

  // Insert the user data into the database
  const insertQuery = `
    INSERT INTO users (first_name, last_name, email, password)
    VALUES (?, ?, ?, ?)
  `;

  db.run(insertQuery, [firstName, lastName, email, password], (err) => {
    if (err) {
      console.error('Error inserting user data:', err.message);
      return res.status(500).send('An error occurred while signing up.');
    }

    res.send('Signup successful!');
  });
});

module.exports = router;
