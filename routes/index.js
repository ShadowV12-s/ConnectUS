const express = require('express');
const router = express.Router();

// Define routes

// home page
router.get('/', (req, res) => {
  res.render('home', { pageTitle: 'Home' });
});

//about page
router.get('/about', (req, res) => {
  res.render('about', { pageTitle: 'About' });
});

//about page
router.get('/service', (req, res) => {
  res.render('service', { pageTitle: 'Service' });
});

//calender page
router.get('/calender', (req, res) => {
    res.render('calender', { pageTitle: 'calender' });
  });

//profile page
router.get('/profile', (req, res) => {
    res.render('profile', { pageTitle: 'Profile' });
  });

//signIn page
router.get('/signIn', (req, res) => {
  res.render('signIn', { pageTitle: 'Signin' });
});

module.exports = router;
