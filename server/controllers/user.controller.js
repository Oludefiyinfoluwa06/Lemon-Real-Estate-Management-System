const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '360000s' });

const register = async (req, res) => {
    try {
        const { propertiesOfInterest, lastName, firstName, middleName, currentAddress, country, mobileNumber, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'This email exists already' });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ propertiesOfInterest, profilePicture: '', lastName, firstName, middleName, currentAddress, country, mobileNumber, email, password: hashedPassword, role });

        if (!user) {
            return res.status(400).json({ message: 'Could not save user\'s details' });
        }

        return res.status(201).json({ message: 'Registration successful' });
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

        return res.status(200).json({ message: 'Login successful', accessToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

module.exports = {
    register,
    login,
}