module.exports = async function(to, message) {
  const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  // console.log(client.api.messages.create())
  return await client.messages.create({
    body: message,
    to: to,
    from: process.env.TWILO_NUMBER
  });
};
