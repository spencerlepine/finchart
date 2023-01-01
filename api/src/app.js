const express = require('express');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());

app.use(express.json({ extended: false }));

// Routes
app.use('/', express.static(path.join(__dirname, '../../client/build')));
app.use('/api', apiRoutes);

// Use last resort error handler
app.use(errorHandlerMiddleware);

module.exports = app;
