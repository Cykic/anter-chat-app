const dotenv = require('dotenv');
const processError = require('./src/error/processError');

// Handle process error
processError();

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

// Starting Server
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});

///////////////////////////////////////////////////////////////////////
