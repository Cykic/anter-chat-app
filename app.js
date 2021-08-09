const express = require('express');
const errorController = require('./src/error/errorController');
const AppError = require('./src/error/appError');

const app = express();

const port = process.env.PORT || 3000;

// ERROR PAGE 404
app.all('*', (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(errorController);

// Starting Server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});

module.exports = app;
