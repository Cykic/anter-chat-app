const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');
const processError = require('./src/error/processError');
const connectDB = require('./src/data/mongoDB');


// Handles process Error on express app
processError(app);

// Connect mongoDB
connectDB();
