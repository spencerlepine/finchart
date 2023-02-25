const connectDB = require('./db');
const config = require('./config/config');
const logger = require('./utils/logger');

const app = require('./app');
const port = config.PORT;

// Connect Database
connectDB();

app.listen(port, () => logger.info(`Server running on port ${port}`));
