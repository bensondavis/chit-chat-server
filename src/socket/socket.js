import express from "express";
import http from "http";
import { Server } from "socket.io";

//models
import User from "../db/models/User";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chit-chat-react.vercel.app",
    methods: ["GET", "POST", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("registerSocket", async (userId) => {
    await User.findOneAndUpdate({ username: userId }, { socketId: socket.id });
  });

  socket.on("callUser", async (data) => {
    const user = await User.findOne({ username: data.userToCall });

    io.to(user?.socketId).emit("callUser", {
      signal: data.signalData,
      from: socket.id,
      name: data.name,
      isVideoCall: data.isVideoCall,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("endCall", (data) => {
    io.to([data.to, socket.id]).emit("endCall");
  });

  socket.on("disconnect", async () => {
    console.log("Client disconnected");
    await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
  });
});

export { app, io, server };
