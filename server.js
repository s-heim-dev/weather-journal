projectData = {};

// Initialize Express Application with Middleware
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('website'));

// Setup Server
const port = 8000;
const server = app.listen(port, () => console.log(`server running on localhost:${port}`));
