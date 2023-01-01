const connectDB = require('./db');
const config = require('./config/config');

const app = require('./app');
const port = config.PORT;

// Connect Database
connectDB();

app.listen(port, () => console.log(`Server running on port ${port}`));
