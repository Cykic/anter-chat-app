// Connect to MongoDB
const mongoose = require('mongoose');

// Database Connection
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
const connectDB = () => {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      autoIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('DB connection successful!');
    })
    .catch(err => {
      console.log('Error Connecting DB:...', err.message);
      console.log('Reconnecting !!!');
      connectDB();
    });
};

module.exports = connectDB;
