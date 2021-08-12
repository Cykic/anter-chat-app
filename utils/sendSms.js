const AppError = require('../src/error/appError');

module.exports = function(to, message) {
  const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  // console.log(client.api.messages.create())
  return client.messages
    .create({
      body: message,
      to: to,
      from: process.env.TWILO_NUMBER
    })
    .then(function(data) {
      console.log('Sms Sent', data);
    })
    .catch(function(err) {
      if (process.env.NODE_ENV !== 'production') console.error(err);
      console.log('sms failed to send');
    });
};
