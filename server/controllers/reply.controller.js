const Reply = require("../models/reply.model");

const replyToReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { text } = req.body;

        if (!isValidObjectId(reviewId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const reply = await Reply.create({ text });

        if (!reply) {
            return res.status(400).json({ message: 'Could not send reply, try again' });
        }

        return res.status(201).json({ message: 'Reply sent successfully', reply });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const updateReply = async (req, res) => {
    try {
        const replyId = req.params.id;
        const { text } = req.body;

        if (!isValidObjectId(replyId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const reply = await Reply.findByIdAndUpdate(replyId, { text }, { new: true });

        if (!reply) {
            return res.status(400).json({ message: 'Could not update reply, try again' });
        }

        return res.status(200).json({ message: 'Reply updated successfully', reply });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const deleteReply = async (req, res) => {
    try {
        const replyId = req.params.id;

        if (!isValidObjectId(replyId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const reply = await Reply.findByIdAndDelete(replyId);

        if (!reply) {
            return res.status(400).json({ message: 'Could not delete reply, try again' });
        }

        return res.status(200).json({ message: 'Reply deleted successfully', reply });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

module.exports = {
    replyToReview,
    updateReply,
    deleteReply
}