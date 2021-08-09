const dotenv = require('dotenv');
const processError = require('./src/error/processError');

// Handle process error
processError();

dotenv.config({ path: './config.env' });
