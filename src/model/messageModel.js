const mongoose = require('mongoose');
const User = require('./userModel');

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

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;