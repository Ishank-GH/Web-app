const asyncHandler = require('../middlewares/asyncHandler.middleware');
const messageModel = require('../models/message.model');
const { uploadOnCloudinary } = require('../services/upload.service');


exports.recentChats = asyncHandler(async(req, res) => {
  try {
    const messages = await messageModel.find({
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'username email avatar')
    .populate('recipient', 'username email avatar');

    const uniqueUsers = new Map();

    // Process each message safely
    messages.forEach(message => {
      if (!message.sender || !message.recipient) return; // Skip invalid messages

      const isUserSender = message.sender._id.toString() === req.user._id.toString();
      const otherUser = isUserSender ? message.recipient : message.sender;

      // Only add if we have a valid other user
      if (otherUser && otherUser._id && !uniqueUsers.has(otherUser._id.toString())) {
        uniqueUsers.set(otherUser._id.toString(), {
          _id: otherUser._id,
          username: otherUser.username,
          email: otherUser.email,
          avatar: otherUser.avatar || {
            type: 'initial',
            color: 'bg-blue-600 text-white'
          },
          lastMessage: {
            content: message.content,
            timestamp: message.timestamp,
            messageType: message.messageType
          }
        });
      }
    });

    const recentChats = Array.from(uniqueUsers.values());
    res.json(recentChats);

  } catch (error) {
    console.error('Error in recentChats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent chats',
      error: error.message
    });
  }
});

exports.getHistory = asyncHandler(async (req, res) => {
  try {
    const messages = await messageModel.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    })
    .sort({ timestamp: 1 })
    .populate('sender', 'username email avatar')
    .populate('recipient', 'username email avatar');

    res.json(messages);
  } catch (error) {
    console.error('Error in getHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message history',
      error: error.message
    });
  }
});

exports.uploadFile = asyncHandler(async(req, res) => {
    if (!req.file) {
        return res.status(400).json({ 
            success: false,
            message: "No file uploaded" 
        });
    }

    try {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        
        if (!cloudinaryResponse) {
            return res.status(500).json({ 
                success: false,
                message: "Failed to upload file to cloud storage" 
            });
        }

        res.status(200).json({
            success: true,
            filePath: cloudinaryResponse.secure_url,
            message: "File uploaded successfully"
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Error uploading file: " + error.message
        });
    }
});