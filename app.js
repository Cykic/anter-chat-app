const express = require('express');
const morgan = require('morgan');

const userRouter = require('./src/routes/userRoutes');
const errorController = require('./src/error/errorController');
const AppError = require('./src/error/appError');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const port = process.env.PORT || 3000;

// MIDDLEWARES
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));

// ROUTES
app.use('/api/v1/users', userRouter);

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
