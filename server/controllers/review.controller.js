const { isValidObjectId } = require("mongoose");
const User = require("../models/user.model");
const Review = require("../models/review.model");

const createReview = async (req, res) => {
    try {
        const { text, rating, propertyId } = req.body;
        const userId = req.user._id;

        if (!isValidObjectId(propertyId)) {
            return res.status(400).json({ message: 'Invalid property Id' });
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid property Id' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const review = await Review.create({
            text,
            userProfilePicture: user.profilePicture,
            userName: `${user.lastName} ${user.firstName}`,
            propertyId,
            rating,
            replies: []
        });

        if (!review) {
            return res.status(400).json({ message: 'Could not post review' });
        }

        return res.status(201).json({ message: 'Review posted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find();

        if (!reviews) {
            return res.status(404).json({ message: 'No reviews available' });
        }

        return res.status(200).json({ reviews });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { text } = req.body;

        if (!isValidObjectId(reviewId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const review = await Review.findByIdAndUpdate(reviewId, { text }, { new: true });

        if (!review) {
            return res.status(400).json({ message: 'Could not update review, try again' });
        }

        return res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;

        if (!isValidObjectId(reviewId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const review = await Review.findByIdAndDelete(reviewId);

        if (!review) {
            return res.status(400).json({ message: 'Could not delete review, try again' });
        }

        return res.status(200).json({ message: 'Review deleted successfully', review });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

module.exports = {
    createReview,
    getReviews,
    updateReview,
    deleteReview,
}