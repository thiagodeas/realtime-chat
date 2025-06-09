import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  let userName: string = "";

  socket.on("join", (name: string) => {
    userName = name;
    io.emit("Mensagem do sistema: ", `${userName} entrou no chat.`);
  });

  socket.on("chat message", (data: { name: string; message: string }) => {
    io.emit("chat message", data);
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
