const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const messageModel = require("./models/message.model");
const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store user socket mappings
const userSocketMap = new Map();

const handleDisconnect = (socket) => {
  console.log(`User disconnected: ${socket.id}`);
  for (const [userId, socketId] of userSocketMap.entries()) {
    if (socketId === socket.id) {
      userSocketMap.delete(userId);
      io.emit('userOffline', userId); // Notify others user is offline
      break;
    }
  }
};

const handleMessage = async(messageData, socket) => {
  try {
    const { sender, recipient, content, messageType = 'text' } = messageData;

    if (!sender || sender !== socket.userId) {
      throw new Error('Invalid sender');
    }

    const message = await messageModel.create({
      sender,
      recipient,
      messageType,
      content,
      timestamp: new Date()
    });


    const populatedMessage = await messageModel.findById(message._id)
      .populate('sender', 'username email avatar')
      .populate('recipient', 'username email avatar');


    const recipientSocket = userSocketMap.get(recipient);
    
    // Send to recipient if online
    if (recipientSocket) {
      io.to(recipientSocket).emit('receiveMessage', populatedMessage);
    }

    // Send back to sender
    socket.emit('receiveMessage', populatedMessage);

    return populatedMessage;

  } catch (error) {
    console.error('Message error:', error);
    socket.emit('messageError', error.message);
  }
};


io.on("connection", async(socket) => {
  try {
    // Get user ID from auth token
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new Error('No auth token provided');
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    // Store socket mapping
    socket.userId = userId;
    userSocketMap.set(userId, socket.id);
    
    // Notify others user is online
    io.emit('userOnline', userId);

    console.log(`User connected: ${userId} (${socket.id})`);


    socket.on('sendMessage', (data) => handleMessage(data, socket));
    socket.on("disconnect", () => handleDisconnect(socket));

  } catch (error) {
    console.error('Socket connection error:', error);
    socket.disconnect();
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
