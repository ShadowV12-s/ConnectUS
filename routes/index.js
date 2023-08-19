const express = require('express');
const router = express.Router();
const passport = require('passport');
const data = require('../data/data'); 
const { insertService } = require('../data/data');

// Define routes
const user = {
  id: '<%= user.id %>', 
};

// home page
router.get('/', (req, res) => {
  res.render('home', {pageTitle: 'Home', user: user });
});


// about page
router.get('/about', (req, res) => {
  res.render('about', { pageTitle: 'About', user: user });
});

// service page
router.get('/service', (req, res) => {
  data.getServices() // Corrected function call to getServices()
    .then((service_rows) => {
      res.render('service', { pageTitle: 'Service', services: service_rows, user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
});

// submit service page
router.get('/submit-service', (req, res) => {
  res.render('submit-service', { pageTitle: 'Submit Service', user: user });
});

// Route to handle form submissions
router.post('/submitService', async (req, res) => {
  // Extract form data from the request body
  const {
    serviceName,
    email,
    description,
    date,
    time,
    time2,
    hours,
    address,
  } = req.body;

  try {
    // Call the insertService function to insert the data into the database
    const insertedServiceId = await insertService({
      serviceName,
      email,
      description,
      date,
      time,
      time2,
      hours,
      address,
    });

    // Redirect the user back to the home page after the form submission
    res.redirect('/service');
  } catch (error) {
    // Handle any errors that occurred during the insertion process
    console.error('Error inserting data:', error);
    res.status(500).send('An error occurred while processing the form data.');
  }
});


// calender page
router.get('/calender', (req, res) => {
  res.render('calender', { pageTitle: 'Calender', user: user });
});

// profile page
router.get('/profile', (req, res) => {
  const user = req.user;

  if (user === undefined) {
    res.redirect("/sign-in");
  } else {
    // Pass the user object to the template context
    res.render('profile', { pageTitle: 'Profile', user: user });
  }
});


// sign-in page
router.get('/sign-in', (req, res) => {
  res.render('sign-in', { pageTitle: 'Sign-in', userAccessToken: req.session.access_token, user: user });
});


// Define the Google OAuth routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Redirect the user to a success page or handle the response as needed
  res.redirect('/user_info');
});

router.get('/user_info', (req, res) => {
  // Access the authenticated user's information via req.user
  // This will contain the profile information returned from Google OAuth
  const user = req.user;
  res.render('user_info', { pageTitle: 'User Information', user });
});

// Add more routes here if needed

module.exports = router;
