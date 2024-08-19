const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    propertiesOfInterest: {
        type: [String],
        required: () => this.role === 'buyer',
    },
    profilePicture: { type: String },
    lastName: { 
        type: String, 
        required: () => this.role === 'buyer', 
    },
    firstName: { 
        type: String, 
        required: () => this.role === 'buyer', 
    },
    middleName: { type: String, },
    companyName: { type: String, },
    currentAddress: { type: String, required: true, },
    country: { type: String, required: true, },
    mobileNumber: { type: String, required: true, },
    email: { type: String, required: true, },
    password: { type: String, required: true, },
    role: {
        type: String,
        enum: ['buyer', 'individual-agent', 'company-agent'],
        required: true
    }
});

const User = mongoose.model('users', userSchema);
module.exports = User;