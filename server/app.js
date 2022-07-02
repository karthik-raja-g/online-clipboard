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
let rooms = []
// io.use((socket,next) => {
//   let handshake = socket.handshake;
//   next();
// })
io.on("connection", (socket) => {
  let handshake = socket.handshake;
  console.log(rooms)
  // console.log(handshake.auth)
  if(handshake.auth?.sessionId) {
    const currentRoom = rooms.find(room => room.uniqueId == handshake.auth.sessionId);
    if(currentRoom) {
      socket.broadcast.emit('old messages', currentRoom.messages || [])
    } 
  } else {
    const conId = uuid();
    const data = {
      socketId: socket.id,
      uniqueId: conId,
      messages: []
    }
    rooms.push(data)
    socket.broadcast.emit('register room', conId)
    console.log('register room', data)
  }
  socket.on("chat message", (msg) => {
    if (!sockets.includes(socket.id)) {
      sockets.push(socket.id);
    }
    console.log(sockets);
    socket.broadcast.emit("chat message", msg);
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
