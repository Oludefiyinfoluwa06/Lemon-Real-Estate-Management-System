const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) { 
        return res.status(400).json({ message: 'Provide token' });
    }

    const tokenValue = token.split(' ')[1];

    jwt.verify(tokenValue, process.env.JWT_SECRET, async (error, decodedToken) => {
        if (error) {
            console.log(error);
            return res.status(400).json({ message: 'Please, authenticate' });
        }

        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    });
}

module.exports = { authenticate };