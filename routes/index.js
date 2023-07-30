const express = require('express');
const router = express.Router();
const data = require('../data/data'); 

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
router.get('/submit-service', (req, res) =>{
  res.render('submit-service', { pageTitle: 'submit-service' });
})

  //calender page
  router.get('/calender', (req, res) => {
      res.render('calender', { pageTitle: 'calender' });
    });

  //profile page
  router.get('/profile', (req, res) => {
      res.render('profile', { pageTitle: 'Profile' });
    });

  //sign-in page
  router.get('/sign-in', (req, res) => {
    res.render('sign-in', { pageTitle: 'Sign-in' });
  });

  router.get('/user_info', (req, res) => {
    res.render('user_info', { pageTitle: 'user_info' });
  });


  module.exports = router;
