const express = require('express');
const path = require('path');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Import the insertService function from data.js 
const { insertService } = require('./data/data.js');


const { insertUser, getUserByGoogleId } = require('./data/user-database.js');
// Connect to the SQLite3 database
const db = new sqlite3.Database('./data/mydatabase.db', (error) => {
  if (error) {
    console.error('Database connection error:', error);
  } else {
    console.log('Connected to the database.');
  }
});

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Replace these with your own values from the Google Developer Console
const GOOGLE_CLIENT_ID = '1016379132915-m4t3kmni1n3obr3kp1p2eo6ekkuvnaf0.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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'; 
const REDIRECT_URL = 'http://localhost:3000/auth/google/callback';

// Configure the Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: REDIRECT_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        const existingUser = await getUserByGoogleId(profile.id);
        
        if (existingUser) {
          // User already exists, retrieve their data
          return done(null, existingUser);
        } else {
          // User doesn't exist, insert the new user into the database
          await insertUser(profile.id, profile.emails[0].value, profile.displayName, profile.photos[0].value);
          
          // Retrieve the newly inserted user
          const newUser = await getUserByGoogleId(profile.id);
          
          return done(null, newUser);
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        return done(error, false);
      }
    }
  )
);


// Serialize and deserialize user (you can customize this based on your user database)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Middleware for session management
app.use(
  session({
    secret: '1285320', // Replace this with a strong secret key
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define the Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
  // If authentication was successful, req.user will contain the user's profile data

  // Get the authorization code from the query parameters
  const authorizationCode = req.query.code;

  // Use the authorization code to exchange for an access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code: authorizationCode,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URL,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenResponse.json();

  // The access token will be in tokenData.access_token

  // Now you can use the access token to make authenticated requests to Google APIs
  // For example, to get the user's ID:
  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const userInfo = await userInfoResponse.json();

  // The user's ID will be in userInfo.sub

  // You can store the access token and user's ID in the session, database, or wherever you need
  // ...

  // Redirect the user to a success page or handle the response as needed
  res.redirect('/profile');
});

// Custom middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

// Route to handle user logout
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


// Route to get user information using the access token
app.get('/api/user', async (req, res) => {
  const accessToken = req.query.access_token;

  if (!accessToken) {
    return res.status(400).json({ error: 'Access token not provided' });
  }

  try {
    // Fetch user information from Google API using the access token
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userInfo = await userInfoResponse.json();
    res.json(userInfo);
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ error: 'An error occurred while fetching user information' });
  }
});


// Route to handle form submissions
app.post('/submit', async (req, res) => {
  // Extract form data from the request body
  const { service_name, service_description, time_date, amount_of_hours, location, contacts } = req.body;

  // Create an array with the form data to be inserted into the database
  const values = [service_name, service_description, time_date, amount_of_hours, location, contacts];

  try {
    // Insert the data into the database using the imported function
    await insertService(values);

    // Redirect the user back to the home page after the form submission
    res.redirect('/service');
  } catch (error) {
    // Handle any errors that occurred during the insertion process
    console.error('Error inserting data:', error);
    res.status(500).send('An error occurred while processing the form data.');
  }
});

// Set the path to the views directory
app.use(express.static(path.join(__dirname, "assets")));

// Require the routes from the routes/index.js file
const routes = require('./routes/index');

// Use the routes middleware
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
