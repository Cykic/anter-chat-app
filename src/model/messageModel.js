const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Messsage cannot be empty!']
  },
  image: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Message must belong to a user!']
  }
});

messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username phoneNumber'
  });
  next();
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
