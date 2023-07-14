const express = require('express');
const router = express.Router();

// Define routes

// home page
router.get('/', (req, res) => {
  console.log("----At the Home page")
  res.render('home', { pageTitle: 'Home' });
});

//about page
router.get('/about', (req, res) => {
  console.log("----At the about page")
  res.render('about', { pageTitle: 'About' });
});

//about page
router.get('/service', (req, res) => {
  console.log("----At the service page")
  res.render('service', { pageTitle: 'Service' });
});

//map page
router.get('/map', (req, res) => {
    console.log("----At the map page")
    res.render('map', { pageTitle: 'maps' });
  });

//contact page
router.get('/contacts', (req, res) => {
    console.log("----At the Contacts page")
    res.render('contacts', { pageTitle: 'Contacts' });
  });

//signIn page
router.get('/signIn', (req, res) => {
  console.log("----At the Signin page")
  res.render('signIn', { pageTitle: 'Signin' });
});

module.exports = router;
