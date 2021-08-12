const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

const userRouter = require('./src/routes/userRoutes');
const messageRouter = require('./src/routes/messageRoutes');
const errorController = require('./src/error/errorController');
const AppError = require('./src/error/appError');
const homeRouter = require('./src/routes/homeRouter');


//Start express app
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const port = process.env.PORT || 3000;

app.enable('trust proxy');

// Implement CORS
app.use(cors()); // Access-Control-Allow-Origin * ('*' means all the requests no matter where they are coming from)

app.options('*', cors());

//Set security HTTP headers. NOTE: Always use for all ur express applications!
app.use(helmet());

//Limit requests from the same API
const limiter = rateLimit({
  max: 100, //100 request per hour
  windowMs: 60 * 60 * 1000, //1 hour in milliseconds
  message: 'Too many request from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// MIDDLEWARES
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization XSS(cross-site scripting)
app.use(xss());

//Compress all the texts that is sent to clients
app.use(compression());

// ROUTES
app.use('/', homeRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/messages', messageRouter);

// ERROR PAGE 404
app.all('*', (req, res, next) => {
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
