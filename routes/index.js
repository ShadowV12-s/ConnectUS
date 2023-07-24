const express = require('express');
const router = express.Router();
const data = require('./data.js'); 


  // Define routes

  // home page
  router.get('/', (req, res) => {
    res.render('home', { pageTitle: 'Home' });
  });

  //about page
  router.get('/about', (req, res) => {
    res.render('about', { pageTitle: 'About' });
  });

  //service page
  router.get('/service', (req, res) => {
    data.getservices()
      .then((service_rows) => {
        res.render('service', { pageTitle: 'Service', services: service_rows });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Internal Server Error');
      });
  });  

//submit service page
router.get('/submitService', (req, res) =>{
  res.render('submitService', { pageTitle: 'submitService' });
})

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
