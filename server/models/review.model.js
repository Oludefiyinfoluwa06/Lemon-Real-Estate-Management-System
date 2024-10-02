const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    text: { type: String, required: true },
    userProfilePicture: { type: String, required: true },
    userName: { type: String, required: true },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Property'
    },
    rating: { type: Number, required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
}, { timestamps: true });

const Review = mongoose.model('reviews', reviewSchema);
module.exports = Review;