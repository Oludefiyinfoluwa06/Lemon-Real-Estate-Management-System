const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    text: { type: String, required: true },
    userProfilePicture: { type: String, required: true },
    userName: { type: String, required: true },
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Review'
    }
}, { timestamps: true });

const Reply = mongoose.model('replies', replySchema);
module.exports = Reply;