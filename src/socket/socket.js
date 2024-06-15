import express from "express";
import http from "http";
import { Server } from "socket.io";

//models
import Message from "../db/models/Message";
import User from "../db/models/User";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      `${
        process.env.SERVER_ENV === "production"
          ? process.env.CLIENT_URL
          : "http://localhost:3000"
      }`,
    ],
    methods: ["GET", "POST", "DELETE"],
  },
});

io.on('connection', (socket) => {
    console.log("a user connected");
  
    socket.on('registerSocket', async (userId) => {
        console.log(`event -> registerSocket, userId: ${userId}`)
      await User.findOneAndUpdate({username: userId}, { socketId: socket.id });
    });
  
    socket.on('disconnect', async () => {
      console.log('Client disconnected');
      await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
    });
  })

export {app, io, server};