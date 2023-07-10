const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

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
