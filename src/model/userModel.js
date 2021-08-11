const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const AppError = require('./../error/appError');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide your username!'],
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: [true, 'Please provide your phone number!'],
        unique: true,
        minlength: 11,
        maxlength: 11
    },
    password: {
        type: String,
        required: [true, 'Please provide your password!'],
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
        // select: false
    },
    posts: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Post'
        }
    ],
    verificationCode: String,
    verificationExpires: Date
});

//Hashing the password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.sendPhoneVerification = function() {
  // 1.) generate random 6 digit statusCode
  const code = Math.floor(Math.random() * 899999 + 100000);
  // 2.)hash it
  this.verificationCode = crypto
    .createHash('md5')
    .update(code)
    .digest('hex');

  this.verificationExpires = Date.now() + 5 *  60 * 1000;
  // 4.) Send unhased to user phone number
  

  return code
};

//FOR LOGGING IN: Checking if the inputted password matches that in the database
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model('User', userSchema);
module.exports = User;
