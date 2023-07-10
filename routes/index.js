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

//map page
router.get('/map', (req, res) => {
    console.log("----At the map page")
    res.render('map', { pageTitle: 'maps' });
  });

//contact page
router.get('/contact', (req, res) => {
    console.log("----At the Contacts page")
    res.render('contacts', { pageTitle: 'Contacts' });
  });

module.exports = router;
