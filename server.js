const dotenv = require('dotenv');
const app = require('./app');
const processError = require('./src/error/processError');

// Handles process Error on express app
processError(app);

dotenv.config({ path: './config.env' });
