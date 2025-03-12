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
      io.emit("userOffline", userId); // Notify others user is offline
      break;
    }
  }
};

const handleMessage = async (message) => {
  const senderSocketId = userSocketMap.get(message.sender);
  const recipientSocketId = userSocketMap.get(message.recipient);

  const createdMessage = await messageModel.create(message)

  // const { sender, recipient, content, messageType = "text" } = messageData;

  // if (!sender || sender !== socket.userId) {
  //   throw new Error("Invalid sender");
  // }

  // const message = await messageModel.create({
  //   sender,
  //   recipient,
  //   messageType,
  //   content,
  //   timestamp: new Date(),
  // });

  const populatedMessage = await messageModel
    .findById(createdMessage._id)
    .populate("sender", "username email avatar")
    .populate("recipient", "username email avatar");


  // Send to recipient if online
  if (recipientSocketId) {
    io.to(recipientSocketId).emit("receiveMessage", populatedMessage);
  }
  if (senderSocketId) {
    io.to(senderSocketId).emit("receiveMessage", populatedMessage);
  }
};

io.on("connection", async (socket) => {
  try {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with (${socket.id})`);
    }

    // Notify others user is online
    io.emit("userOnline", userId);

    socket.on("sendMessage", (data) => handleMessage(data, socket));
    socket.on("disconnect", () => handleDisconnect(socket));
  } catch (error) {
    console.error("Socket connection error:", error);
    socket.disconnect();
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
