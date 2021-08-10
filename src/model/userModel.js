const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide your username!'],
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide your phone number!'],
        unique: true
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
    ]
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model('User', userSchema);
module.exports = User;