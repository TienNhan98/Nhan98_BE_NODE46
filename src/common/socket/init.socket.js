import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "../prisma/init.prisma.js";
import handleChatSocket from "./chat.socket.js";
import handleNotification from "./notification.js";
const initSocket = (httpServer) => {
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    console.log(`id: ${socket.id}`);
    handleChatSocket(io, socket);
    handleNotification(io, socket);
  });
};

export default initSocket;
