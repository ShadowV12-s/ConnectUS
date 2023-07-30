const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const signupController = require('./assets/script/signupController.js');
const loginController = require('./assets/script/loginController.js');
// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Import the insertService function from data.js
const { insertService } = require('./data/data.js');

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Route to handle form submissions
app.post('/submit', (req, res) => {
  // Extract form data from the request body
  const { service_name, service_description, time_date, amount_of_hours, location, contacts } = req.body;

  // Create an array with the form data to be inserted into the database
  const values = [service_name, service_description, time_date, amount_of_hours, location, contacts];

  // Insert the data into the database using the imported function
  insertService(values);

  // Redirect the user back to the home page after the form submission
  res.redirect('/service');
});


// Use the signupController for signup routes--for signups
app.use('/signup', signupController);

// Set the path to the views directory
app.use(express.static(path.join(__dirname, "assets")));

// Require the routes from the routes/index.js file
const routes = require('./routes/index');

// Use the routes middleware
app.use('/', routes);

// Use the loginController for login routes
app.use('/login', loginController);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
