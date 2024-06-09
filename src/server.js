const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const dotenv = require("dotenv");
// const callRoutes = require('./routes/call');
const Message = require("./models/Message");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
// app.use('/api/call', callRoutes);

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Connected to db");
});

io.on('connection', (socket) => {
  console.log('New client connected');

  // Add chat and call event handling here
  socket.on('sendMessage', async (data) => {
    const { sender, content } = data;
    const message = new Message({ sender, content });
    await message.save();
    io.emit('message', message);
  });

  socket.on('deleteMessage', async (messageId) => {
    await Message.findByIdAndDelete(messageId);
    io.emit('deleteMessage', messageId);
  });

  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', { signal: data.signal, from: data.from, name: data.name });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));