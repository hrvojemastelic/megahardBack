// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const routes = require('./src/routes/routes'); // Import the routes module

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Use the routes
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
