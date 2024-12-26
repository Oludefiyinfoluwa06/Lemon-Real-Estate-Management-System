const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require("mongoose");
const nodemailer = require('nodemailer');

const createAccessToken = async (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 360000 });
};

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
        const accessToken = await createAccessToken(userId);

        return res.status(201).json({ message: 'Registration successful', accessToken, role: user.role, id: userId });
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
        const accessToken = await createAccessToken(userId);

        return res.status(200).json({ message: 'Login successful', accessToken, role: user.role, id: userId });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = new Date(Date.now() + 2 * 60 * 60 * 1000);

        const emailBody = `
            <h1>Otp Request</h1>
            <p>The otp you requested is ${otp} and it expires in 2 hours</p>
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Otp Request',
            html: emailBody
        }

        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                return res.json({ 'error': 'An error occurred' });
            }

            await Otp.create({ email, otp, otpExpires });
        });


        return res.status(200).json({ message: 'Otp sent successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const currentTime = new Date();
        const otpExpires = otpRecord.otpExpires;

        if (otpRecord.otp === otp && currentTime <= otpExpires) {
            otpRecord.otp = null;
            otpRecord.otpExpires = null;

            await otpRecord.save();

            return res.status(200).json({ message: 'OTP has been verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    return res.status(200).json({ message: 'Password was reset successfully', user: updatedUser });
}

const updateUser = async (req, res) => {
    try {
        const id = req.user._id;

        const user = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!user) {
            return res.status(400).json({ message: 'Could not update your profile details' });
        }

        return res.status(200).json({ message: 'You\'ve updated your profile details successfully' });
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
    forgotPassword,
    verifyOtp,
    resetPassword,
    updateUser,
    getUser,
}