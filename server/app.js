const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ShortUniqueId = require("short-unique-id");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001"
  }
});

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

const uuid = new ShortUniqueId({
  length: 6,
});

let sockets = [];
io.on("connection", (socket) => {
  const conId = uuid();
  console.log(socket)
  socket.on("chat message", (msg) => {
    console.log({ conId, random: Math.random() });
    if (!sockets.includes(socket.id)) {
      sockets.push(socket.id);
    }
    console.log(sockets);
    socket.emit("chat message", msg);
    socket.broadcast.emit("typing off", { name: "hola" });
  });
  socket.on("typing on", (msg) => {
    console.log(msg);
    socket.broadcast.emit("typing on", { name: "hola" });
  });
  socket.on("typing off", (msg) => {
    console.log(msg);
    socket.broadcast.emit("typing off", { name: "hola" });
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
