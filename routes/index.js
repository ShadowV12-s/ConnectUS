const express = require('express');
const router = express.Router();
const passport = require('passport');
const data = require('../data/data'); 
const { insertService } = require('../data/data');
// Import the user and service databases
const userDB = require('../data/user-database'); // Replace 'userDatabase' with the actual user database module
const serviceDB = require('../data/data'); // Replace 'serviceDatabase' with the actual service database module

// Define routes
const user = {
  id: '<%= user.id %>', 
};



// Google OAuth callback
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Check here: Inspect 'req.user' to ensure it contains user data from Google OAuth.
  console.log(req.user); // Log user data to the console for debugging
  res.redirect('/user_info');
});

// User info page
router.get('/user_info', (req, res) => {
  // Check here: 'req.user' should contain the authenticated user's data from Google OAuth.
  const user = req.user;
  res.render('user_info', { pageTitle: 'User Information', user });
});

// home page
router.get('/', (req, res) => {
  // Determine if the user is authenticated and pass the appropriate value
  const user = req.user ? req.user : null;
  res.render('home', { pageTitle: 'Home', user: user });
});


// about page
router.get('/about', (req, res) => {
  const user = req.user ? req.user : null;
  res.render('about', { pageTitle: 'About', user: user });
});

// service page
router.get('/service', (req, res) => {
  // Retrieve user information from the request object or set it to null if not available
  const user = req.user || null;

  // Call the getServices function from the 'serviceDB' module
  serviceDB.getServices()
    .then((service_rows) => {
      // Render the 'service' template with the retrieved data and user information
      res.render('service', { pageTitle: 'Service', services: service_rows, user: user });
    })
    .catch((err) => {
      // Handle errors and send an internal server error response
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});
// Assuming you have the necessary imports and middleware set up

// Modify your /service route
router.get('/service', (req, res) => {
  // Retrieve user information from the request object or set it to null if not available
  const user = req.user || null;

  // Call the getServices function from the 'serviceDB' module to fetch available services
  serviceDB.getServices()
    .then((service_rows) => {
      // Render the 'service' template with the retrieved data and user information
      res.render('service', { pageTitle: 'Service', services: service_rows, user: user });
    })
    .catch((err) => {
      // Handle errors and send an internal server error response
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// Add a new route handler to handle user sign-ups for services
router.post('/service/sign-up', (req, res) => {
  // Retrieve the service ID from the request body
  const { serviceId } = req.body;

  // Check if the user is authenticated
  if (!req.isAuthenticated()) {
    // Handle the case where the user is not authenticated
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  // Get the authenticated user's ID
  const userId = req.user.id;

  // Insert a record into the user_service table to represent the sign-up
  // You'll need to modify this part based on your database schema
  // Here, we assume you have a user_service table with columns (user_id, service_id)
  // Adjust the SQL query and database handling accordingly
  serviceDB.insertUserService(userId, serviceId)
    .then(() => {
      res.status(200).json({ message: 'Successfully signed up for the service' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to sign up for the service' });
    });
});



// submit service page
router.get('/submit-service', (req, res) => {
  const user = req.user ? req.user : null;
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
  const user = req.user ? req.user : null;
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
  const user = req.user ? req.user : null;
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
// Add this route after your other routes
router.get('/sign-out', (req, res) => {
  req.logout(() => {
    res.redirect('/'); // Redirect to home page or another suitable page after logout
  });
});

router.get('/terms-and-conditions', (req, res) => {
  const user = req.user ? req.user : null;
  res.render('terms-and-conditions', { pageTitle: 'terms-and-conditions', userAccessToken: req.session.access_token, user: user });
});

router.get('/privacy-policy', (req, res) => {
  const user = req.user ? req.user : null;
  res.render('privacy-policy', { pageTitle: 'privacy-policy', userAccessToken: req.session.access_token, user: user });
});


// Route for sign-up
router.post('/registration/sign-up', (req, res) => {
  const { serviceId } = req.body;
  const userId = req.user.id; // Assuming you have middleware to populate req.user

  // Insert a new registration record into the service database
  serviceDB.run(
    'INSERT INTO registration (service_id, user_id, action) VALUES (?, ?, ?)',
    [serviceId, userId, 'sign-up'],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'An error occurred' });
      }

      return res.status(201).json({ message: 'Registration successful' });
    }
  );
});

// Route for cancel
router.post('/registration/cancel', (req, res) => {
  const { serviceId } = req.body;
  const userId = req.user.id; // Assuming you have middleware to populate req.user

  // Delete the registration record from the service database
  serviceDB.run(
    'DELETE FROM registration WHERE service_id = ? AND user_id = ? AND action = ?',
    [serviceId, userId, 'sign-up'],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'An error occurred' });
      }

      return res.status(200).json({ message: 'Registration canceled' });
    }
  );
});


// Add more routes here if needed

module.exports = router;
