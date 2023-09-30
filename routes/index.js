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
      res.status(400).json({ error: 'User has already signed up for this service' });
      console.log("Already registered");
    } else {
      // Perform database operations to sign up the user
      const insertStmt = db.prepare('INSERT INTO registration (user_id, service_id) VALUES (?, ?)');
      insertStmt.run(userID, serviceID);
      insertStmt.finalize();
            
      console.log(serviceID);
      console.log(userID);
      res.json({ success: true });
    }
  });
});

router.post('/cancel-registration', (req, res) => {
  const { serviceID, userID } = req.body;

  const stmt = db.prepare('SELECT * FROM registration WHERE user_id = ? AND service_id = ?');
    stmt.get(userID, serviceID, (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      if (row) {
        const stmt1 = db.prepare('DELETE FROM registration WHERE user_id = ? AND service_id = ?');
        stmt1.run(userID, serviceID, (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
            return;
          }
          res.json({ success: true });
        });
      } else {
        res.json({ success: false });
        console.log("not signed up");
      }
    });

});



// submit service page
router.get('/submit-service', checkPermission3, (req, res) => {
  const user = req.user ? req.user : null;
  res.render('submit-service', { pageTitle: 'Submit Service', user: user });
});

// Define a middleware function to check user's permission
function checkPermission(req, res, next) {
  const user = req.user;

  if (user && user.permission === 1) {
    next(); // User has permission 1, continue to the next middleware
  } else {
    res.status(403).send("You do not have permission to access this page."); // User does not have permission, send a forbidden status
  }
}

// Apply the middleware to the '/control' route
router.get('/control', checkPermission, (req, res) => {
  const user = req.user ? req.user : null;
  const sql = 'SELECT * FROM users';

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    res.render('control', { pageTitle: 'control', user: user, users: rows });
  });
});

router.post('/updatePermission', (req, res) => {
  const userId = req.body.userId;
  const newPermission = req.body.newPermission;

  const sql = 'UPDATE users SET permission = ? WHERE id = ?';

  db.run(sql, [newPermission, userId], (err) => {
    if (err) {
      throw err;
    }

    // Redirect back to the control page
    res.redirect('/control');
  });
});

router.post('/updatePermission2', (req, res) => {
  const userId = req.body.userId;
  const newPermission = req.body.newPermission;

  const sql = 'UPDATE users SET permission = ? WHERE id = ?';

  db.run(sql, [newPermission, userId], (err) => {
    if (err) {
      throw err;
    }

    // Redirect back to the control page
    res.redirect('/control2');
  });
});


// Define a middleware function to check user's permission
function checkPermission2(req, res, next) {
  const user = req.user;

  if (user && (user.permission === 1 || user.permission === 2)) {
    next(); // User has permission 1 or 2, continue to the next middleware
  } else {
    res.status(403).send("You do not have permission to access this page."); // User does not have permission, send a forbidden status
  }
}

// Apply the middleware to the '/control2' route
router.get('/control2', checkPermission2, (req, res) => {
  const user = req.user ? req.user : null;
  const sql = 'SELECT * FROM users';

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    res.render('control2', { pageTitle: 'control2', user: user, users: rows });
  });
});

// Define a middleware function to check user's permission
function checkPermission3(req, res, next) {
  const user = req.user;

  if (user && (user.permission === 1 || user.permission === 2 || user.permission === 3)) {
    next(); // User has permission 1 or 2, continue to the next middleware
  } else {
    res.status(403).send("You do not have permission to access this page."); // User does not have permission, send a forbidden status
  }
}

// Apply the middleware to the '/control2' route
router.get('/control3', checkPermission3, (req, res) => {
  const user = req.user ? req.user : null;
  res.render('control3', { pageTitle: 'control3', user: user });
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
  const stmt = db.prepare('INSERT INTO services (serviceName, email, description, date, time, time2, hours, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
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
router.get('/calendar', (req, res) => {
  const user = req.user ? req.user : null;

  serviceDB.getServices()
    .then((service_rows) => {
      const eventsByDate = {};

      service_rows.forEach(event => {
        const date = event.date; // Assuming date is in a format like 'YYYY-MM-DD'
        if (!eventsByDate[date]) {
          eventsByDate[date] = [];
        }
        eventsByDate[date].push(event);
      });

      res.render('calendar', { pageTitle: 'Calendar', eventsByDate, user: user });
    })
    .catch((err) => {
      // Handle errors and send an internal server error response
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});





// profile page

router.get('/profile', (req, res) => {
  const user = req.user;

  if (user === undefined) {
    res.redirect("/sign-in");
  } else {
    const stmt = db.prepare('SELECT * FROM registration JOIN services ON registration.service_id = services.id WHERE registration.user_id = ?');
    
    stmt.all(user.id, (err, services) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      stmt.finalize(); // Move this inside the callback

      // Pass the user object and services to the template context
      res.render('profile', { pageTitle: 'Profile', user: user, services: services });
      
   
    });
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
