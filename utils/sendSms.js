module.exports = function(to, message) {
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // console.log(client.api.messages.create())
    return client.messages
      .create({
        body: message,
        to: to,
        from: process.env.TWILO_NUMBER,
      }).then(function(data) {
        console.log('ASms Sent', data);
      }).catch(function(err) {
        console.error('Could not Send Sms');
        console.error(err);
      });
  };