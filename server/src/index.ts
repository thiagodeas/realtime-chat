import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  let userName = "";

  socket.on("join", (name) => {
    userName = name;
    io.emit("Mensagem do sistema: ", `${userName} entrou no chat.`);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    if (userName) {
      io.emit("Mensagem do sistema: ", `${userName} saiu do chat.`);
    }
  });
});

httpServer.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});
