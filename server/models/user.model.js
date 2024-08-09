const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    propertiesOfInterest: {
        type: [String],
        required: () => this.role === 'buyer',
        default: [],
    },
    profilePicture: { type: String },
    lastName: { type: String, required: true, },
    firstName: { type: String, required: true, },
    middleName: { type: String, required: true, },
    currentAddress: { type: String, required: true, },
    country: { type: String, required: true, },
    mobileNumber: { type: String, required: true, },
    email: { type: String, required: true, },
    password: { type: String, required: true, },
    role: {
        type: String,
        enum: ['buyer', 'agent'],
        required: true
    }
});

const User = mongoose.model('users', userSchema);
module.exports = User;