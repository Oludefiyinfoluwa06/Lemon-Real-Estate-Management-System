require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const socketIo = require('socket.io');
const http = require('http');

const usersRoute = require('./routes/user.route');
const propertiesRoute = require('./routes/property.route');
const reviewsRoute = require('./routes/review.route');
const chatRoute = require('./routes/chat.route');
const paymentRoute = require('./routes/payment.route');

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const userSocketMap = new Map();

app.use((req, res, next) => {
    req.io = io;
    req.userSocketMap = userSocketMap;
    next();
});

mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('DB connected successfully');
    })
    .catch(err => console.log(err, 'Connection unsuccessful'));

app.use('/api/user', usersRoute);
app.use('/api/property', propertiesRoute);
app.use('/api/reviews', reviewsRoute);
app.use('/api/chat', chatRoute);
app.use('/api/payment', paymentRoute);


io.on('connection', (socket) => {
    socket.on('register', (userId) => {
        userSocketMap.set(userId, socket.id);
        socket.userId = userId;
    });

    socket.on('disconnect', () => {
        if (socket.userId) {
            userSocketMap.delete(socket.userId);
        }
    });
});

server.listen(port, () => console.log(`Server running on port: http://localhost:${port}!`));

module.exports = app;
