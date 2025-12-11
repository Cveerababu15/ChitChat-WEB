const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { addmessage } = require("./controllers/messagecontroller.js");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // serving index.html

// Routes
app.use("/api/messages", require("./routes/messageRoutes.js"));

app.get('/', (req, res) => {
  res.send({
    message: "Welcome to the Chat Application",
    version: '1.0.0',
    endpoints: {
      getMessages: "GET /api/messages",
      createMessage: "POST /api/messages",
      deleteMessage: "DELETE /api/messages/:id",
      testClients: "GET /index.html"
    }
  });
});

// Socket.io Connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Notify others ✔ timestamp fixed
  socket.broadcast.emit('message', {
    user: 'System',
    text: 'A new user has joined the chat',
    timestamp: new Date().toISOString()
  });

  // Receive Chat Message ✔ correct listener
  socket.on("chatMessage", (msg) => {
    const savedMessage = addmessage(msg);
    io.emit("message", savedMessage); 
  });

  // User disconnect ✔ timestamp fixed
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    io.emit('message', {
      user:'System',
      text:'A user has disconnected',
      timestamp: new Date().toISOString()
    });
  });

  // typing functionality
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  // send and receive message with timestamp ✔ FIXED
  socket.on("sendMessage", (data) => {
    const newMessages = addmessage(data);
    io.emit("receiveMessage", newMessages);
  });
});

// 404 Route Not Found
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
