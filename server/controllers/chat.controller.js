const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const nodemailer = require("nodemailer");

const sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const newMessage = new Chat({ senderId, receiverId, message });
    await newMessage.save();

    // create an in-app notification for the receiver
    try {
      const sender = await User.findById(senderId).select("firstName lastName");
      const title = `New message from ${sender ? `${sender.firstName} ${sender.lastName}` : "Someone"}`;
      const body = message.slice(0, 200);

      await Notification.create({
        userId: receiverId,
        type: "chat_message",
        title,
        body,
        data: { chatId: newMessage._id, senderId },
      });

      // send email to notify of new message (non-blocking)
      (async () => {
        try {
          const recipient = await User.findById(receiverId).select("email");
          if (recipient && recipient.email) {
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
              },
            });

            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: recipient.email,
              subject: title,
              html: `<p>${body}</p><p>Open the app to reply.</p>`,
            };

            await transporter.sendMail(mailOptions);
          }
        } catch (err) {
          console.error("Error sending chat notification email:", err.message || err);
        }
      })();
    } catch (err) {
      console.error("Error creating notification:", err.message || err);
    }

    return res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving messages",
      error: error.message,
    });
  }
};

const fetchChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const allChats = await Chat.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      { $sort: { updatedAt: -1 } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$senderId", userId] },
              then: "$receiverId",
              else: "$senderId",
            },
          },
          chatId: { $first: "$_id" },
          lastMessage: { $first: "$message" },
          lastMessageDate: { $first: "$updatedAt" },
          isRead: { $first: "$isRead" },
          senderId: { $first: "$senderId" },
          receiverId: { $first: "$receiverId" },
        },
      },
    ]);

    const userIds = allChats.map((chat) => chat._id);

    const userDetails = await User.find({
      _id: { $in: userIds },
    }).select("firstName lastName profilePicture");

    const userMap = userDetails.reduce((map, user) => {
      map[user._id.toString()] = {
        name: `${user.firstName} ${user.lastName}`,
        profilePicture: user.profilePicture,
      };
      return map;
    }, {});

    const chatList = allChats.map((chat) => {
      const otherUserId = chat._id.toString();
      const otherUser = userMap[otherUserId] || {
        name: "Unknown User",
        profilePicture: "",
      };

      return {
        _id: chat.chatId,
        name: otherUser.name,
        profilePicture: otherUser.profilePicture,
        lastMessage: chat.lastMessage,
        lastMessageDate: chat.lastMessageDate,
        isRead: chat.isRead,
        senderId: chat.senderId.toString(),
        receiverId: chat.receiverId.toString(),
      };
    });

    return res.status(200).json(chatList);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fetching chats",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getChatMessages,
  fetchChats,
};
