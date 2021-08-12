const processError = function(app) {
  process.on('uncaughtException', err => {
    // eslint-disable-next-line no-console
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    // eslint-disable-next-line no-console
    console.log(err.name, err.message);
    process.exit(1);
  });

  //handling all unhandled Promise Rejection in the Application
  process.on('unhandledRejection', err => {
    // eslint-disable-next-line no-console
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    // eslint-disable-next-line no-console
    console.log(err.name, err.message);
    // app.close(() => {
    //   process.exit(1);
    // });
  });
};

module.exports = processError;
