const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const messageModel = require("./models/message.model");
const channelModel = require("./models/channel.model");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store user socket mappings
const userSocketMap = new Map();
const communityRooms = new Map(); // Tracks users in each community channel

const handleDisconnect = (socket) => {
  console.log(`User disconnected: ${socket.id}`);
  for (const [userId, socketId] of userSocketMap.entries()) {
    if (socketId === socket.id) {
      userSocketMap.delete(userId);
      io.emit("userOffline", userId); // Notify others user is offline
      break;
    }
  }
};

const handleMessage = async (message, socket) => {
  try {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await messageModel.create(message);

    const populatedMessage = await messageModel
      .findById(createdMessage._id)
      .populate("sender", "username email avatar")
      .populate("recipient", "username email avatar");

    // Send to recipient if online
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", populatedMessage);
    }
    // Send back to sender
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", populatedMessage);
    }
  } catch (error) {
    console.error('Message handling error:', error);
    socket.emit('error', { message: 'Failed to send message' });
  }
};

const handleCommunityMessage = async (data, socket) => {
  try {
    const { channelId, content, messageType = "text", fileUrl } = data;
    
    const messageData = {
      sender: socket.userId,
      channel: channelId,
      messageType,
      ...(messageType === 'text' ? { content } : { fileUrl }),
      timestamp: new Date()
    };

    const message = await messageModel.create(messageData);

    const populatedMessage = await messageModel
      .findById(message._id)
      .populate('sender', 'username avatar');

    // Broadcast to all users in the channel
    io.to(`channel:${channelId}`).emit('communityMessage', populatedMessage);

  } catch (error) {
    console.error('Error handling community message:', error);
    socket.emit('error', { message: 'Failed to send message' });
  }
};

io.on("connection", async (socket) => {
  try {
    const userId = socket.handshake.query.userId;
    socket.userId = userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ${socket.id}`);
    }

    // Notify others user is online
    io.emit("userOnline", userId);

    socket.on("sendMessage", (data) => handleMessage(data, socket));
    socket.on("disconnect", () => handleDisconnect(socket));

    socket.on("joinChannel", async (channelId) => {
      socket.join(`channel:${channelId}`);
      
      // Track user in channel
      if (!communityRooms.has(channelId)) {
        communityRooms.set(channelId, new Set());
      }
      communityRooms.get(channelId).add(userId);

      // Notify channel about new user
      io.to(`channel:${channelId}`).emit('userJoinedCommunity', {
        userId,
        username: socket.username
      });
    });

    // Handle leaving a community channel
    socket.on("leaveChannel", (channelId) => {
      socket.leave(`channel:${channelId}`);
      
      // Remove user from channel tracking
      if (communityRooms.has(channelId)) {
        communityRooms.get(channelId).delete(userId);
      }

      // Notify channel about user leaving
      io.to(`channel:${channelId}`).emit('userLeftCommunity', {
        userId,
        username: socket.username
      });
    });

    // Handle community messages
    socket.on("sendCommunityMessage", (data) => handleCommunityMessage(data, socket));

  } catch (error) {
    console.error("Socket connection error:", error);
    socket.disconnect();
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
