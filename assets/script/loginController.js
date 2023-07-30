const express = require('express');
const router = express.Router();
const { getUserDataByEmail } = require('../../data/database1');

// Handle the login form submission
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Call the function to get user data by email from the database
  getUserDataByEmail(email, (err, user) => {
    if (err) {
      // Handle internal server error
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      // User not found
      return res.status(404).json({ error: 'User not found' });
    }

    // Check the provided password against the hashed password stored in the database
    // You should use a secure password hashing mechanism (e.g., bcrypt) for production
    if (user.password !== password) {
      // Incorrect password
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Log the user object for debugging purposes
    console.log(user);

    // If the user is authenticated, render the "user_info" EJS template with user data
    res.render('user_info', { user });
  });
});

module.exports = router;
