const Chat = require("../models/chat.model");
const User = require("../models/user.model");

const sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }

    try {
        const newMessage = new Chat({ senderId, receiverId, message });
        await newMessage.save();

        const receiverSocketId = req.userSocketMap.get(receiverId.toString());

        if (receiverSocketId) {
            req.io.to(receiverSocketId).emit('receiveMessage', {
                senderId,
                receiverId,
                message,
                _id: newMessage._id,
                createdAt: newMessage.createdAt
            });
        }

        return res.status(201).json({
            success: true,
            data: newMessage
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message
        });
    }
};

const getChatMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const messages = await Chat.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving messages',
            error: error.message
        });
    }
};

const fetchChats = async (req, res) => {
    const { userId } = req.params;

    try {
        const allChats = await Chat.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                }
            },
            { $sort: { updatedAt: -1 } },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$senderId", userId] },
                            then: "$receiverId",
                            else: "$senderId"
                        }
                    },
                    chatId: { $first: "$_id" },
                    lastMessage: { $first: "$message" },
                    lastMessageDate: { $first: "$updatedAt" },
                    isRead: { $first: "$isRead" },
                    senderId: { $first: "$senderId" },
                    receiverId: { $first: "$receiverId" }
                }
            }
        ]);

        const userIds = allChats.map(chat => chat._id);

        const userDetails = await User.find({
            _id: { $in: userIds }
        }).select('firstName lastName profilePicture');

        const userMap = userDetails.reduce((map, user) => {
            map[user._id.toString()] = {
                name: `${user.firstName} ${user.lastName}`,
                profilePicture: user.profilePicture
            };
            return map;
        }, {});

        const chatList = allChats.map(chat => {
            const otherUserId = chat._id.toString();
            const otherUser = userMap[otherUserId] || {
                name: 'Unknown User',
                profilePicture: ''
            };

            return {
                _id: chat.chatId,
                name: otherUser.name,
                profilePicture: otherUser.profilePicture,
                lastMessage: chat.lastMessage,
                lastMessageDate: chat.lastMessageDate,
                isRead: chat.isRead,
                senderId: chat.senderId.toString(),
                receiverId: chat.receiverId.toString()
            };
        });

        return res.status(200).json(chatList);
    } catch (error) {
        console.error('Error fetching chats:', error);
        return res.status(500).json({
            message: 'An error occurred while fetching chats',
            error: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getChatMessages,
    fetchChats,
};
