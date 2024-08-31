const mongoose = require('mongoose');
const User = require('./user.model');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: {
        type: String,
        enum: ["rent", "lease", "sale"],
        required: true
    },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    images: { type: [String], required: true },
    video: { type: String, required: true },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    agentName: { type: String, required: true },
    agentContact: { type: String, required: true },
    companyName: { type: String, required: true },
    document: { type: String, required: true },
}, { timestamps: true });

const Property = mongoose.model('properties', propertySchema);
module.exports = Property;