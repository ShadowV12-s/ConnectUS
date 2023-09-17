const express = require('express');
const router = express.Router();
const passport = require('passport');
const data = require('../data/data');
const userDB = require('../data/user-database'); // Replace with your user database module
const serviceDB = require('../data/data'); // Replace with your service database module
const sqlite3 = require('sqlite3').verbose(); // Import the sqlite3 module

// Establish a connection to your SQLite database
const db = new sqlite3.Database('data/mydatabase.db');
const Registration = require('../data/registration');

const registration = new Registration(db);

// Define routes
const user = {
  id: '<%= user.id %>', 
};

router.use(express.json());

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




router.post('/signup', (req, res) => {
  const { serviceID, userID } = req.body;

  // Check if the user has already signed up for this service
  const stmt = db.prepare('SELECT * FROM registration WHERE user_id = ? AND service_id = ?');
  stmt.get(userID, serviceID, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (row) {
      // The user has already signed up for this service
      res.status(400).send('User has already signed up for this service');
      console.log("Already registrated")
    } else {
      // Perform database operations to sign up the user
      const insertStmt = db.prepare('INSERT INTO registration (user_id, service_id) VALUES (?, ?)');
      insertStmt.run(userID, serviceID);
      insertStmt.finalize();
      console.log(serviceID);
      console.log(userID);

      res.send({ success: true });
    }
  });
  // // Delete the row from the registration table
  // const stmt1 = db.prepare('DELETE FROM registration WHERE user_id = ? AND service_id = ?');
  // stmt1.run(userID, serviceID, (err) => {
  //   if (err) {
  //     console.error(err);
  //     res.status(500).send('Internal Server Error');
  //     return;
  //   }
});

// submit service page
router.get('/submit-service', (req, res) => {
  const user = req.user ? req.user : null;
  res.render('submit-service', { pageTitle: 'Submit Service', user: user });
});

// Route to handle form submissions
router.post('/submitService', (req, res) => {
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

  // Insert the form data into your database
  const stmt = db.prepare('INSERT INTO your_table_name (serviceName, email, description, date, time, time2, hours, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run(serviceName, email, description, date, time, time2, hours, address, function(err) {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('An error occurred while processing the form data.');
    } else {
      console.log(`Row inserted with ID ${this.lastID}`);
      res.redirect('/service');
    }
    stmt.finalize();
  });
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



// Add more routes here if needed

module.exports = router;
