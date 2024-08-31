const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require("mongoose");

const createAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 360000 });

const register = async (req, res) => {
    try {
        const { 
            propertiesOfInterest, 
            lastName, 
            firstName, 
            middleName, 
            companyName, 
            currentAddress, 
            country, 
            mobileNumber, 
            email, 
            password, 
            role 
        } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'This email exists already' });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            propertiesOfInterest, 
            profilePicture: '', 
            lastName, 
            firstName, 
            middleName, 
            companyName, 
            currentAddress, 
            country, 
            mobileNumber, 
            email, 
            password: hashedPassword, 
            role 
        });

        if (!user) {
            return res.status(400).json({ message: 'Could not save user\'s details' });
        }

        const userId = user._id;
        const accessToken = createAccessToken(userId);

        return res.status(201).json({ message: 'Registration successful', accessToken, role: user.role });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const userId = user._id;
        const accessToken = createAccessToken(userId);

        return res.status(200).json({ message: 'Login successful', accessToken, role: user.role });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const uploadProfilePicture = async (req, res) => {
    try {
        const { profilePictureUrl } = req.body;
        const id = req.user._id;

        const user = await User.findByIdAndUpdate(id, { profilePicture: profilePictureUrl }, { new: true });

        if (!user) {
            return res.status(400).json({ message: 'Could not update profile picture' });
        }

        return res.status(200).json({ message: 'Profile picture upload was successful' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const getUser = async (req, res) => {
    try {
        const id = req.user._id;

        const isValidId = isValidObjectId(id);

        if (!isValidId) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user.toObject();

        return res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

module.exports = {
    register,
    login,
    uploadProfilePicture,
    getUser,
}