const express = require('express');
const router = express.Router();
const { getUserDataByEmail } = require('../routes/database1');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  getUserDataByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check the provided password against the hashed password stored in the database
    // You should use a secure password hashing mechanism (e.g., bcrypt) for production
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // If the user is authenticated, you can send the user data back to the client
    res.json({ user });
  });
});

module.exports = router;
