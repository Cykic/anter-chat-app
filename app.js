const express = require('express');
const errorController = require('./src/error/errorController');
const AppError = require('./src/error/appError');

const app = express();

// ERROR PAGE 404
app.all('*', (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(errorController);

module.exports = app;
