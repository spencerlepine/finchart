const express = require('express');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes/v1');

const app = express();

// Middleware
app.use(cors());

app.use(express.json({ extended: false }));

app.use(cookieParser());

// Routes
app.use('/api/v1', authMiddleware, apiRoutes);

//Serve the static files from the React app
const buildFolder = path.join(__dirname, '../../client/build');
const indexHTMLFile = path.join(__dirname, '../../client/build/index.html');
app.use(express.static(buildFolder));
app.get('*', authMiddleware, (req, res) => res.sendFile(indexHTMLFile));

// Use last resort error handler
app.use(errorHandlerMiddleware);

module.exports = app;
