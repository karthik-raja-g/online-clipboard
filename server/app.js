const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ShortUniqueId = require("short-unique-id");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

const uuid = new ShortUniqueId({
  length: 6,
});

let sockets = [];
let rooms = [];
// io.use((socket,next) => {
//   let handshake = socket.handshake;
//   next();
// })
io.on("connection", (socket) => {
  console.log("connection log");
  const id = uuid();
  const data = {
    name: id,
    owner: socket.id,
    members: [socket.id],
    messages: [],
  };
  rooms.push(data);
  socket.join(id);
  // console.log(rooms);
  // console.log(
  //   `connected to ${socket.id} - ${id} - at ${new Date().getMilliseconds()}`
  // );
  setTimeout(() => {
    socket.emit("sessionId", id);
  }, 3000);
  socket.on("chat message", ({ msg, roomId }) => {
    console.log({ msg, roomId });
    // const roomIndex = rooms.findIndex((room) => room.name == roomId);
    const room = rooms.find((room) => room.name == roomId);
    console.log(room, "found room");
    if (room) {
      const filtered = rooms.filter((room) => room.name != roomId);
      rooms = [...filtered, { ...room, messages: [...room.messages, msg] }];
      io.to(roomId).emit("chat message", msg);
    }
    // if (roomIndex > -1) {
    //   rooms[roomIndex].messages.push(msg);
    //   // socket.broadcast.emit("chat message", msg);
    //   socket.to(roomId).emit("chat message", msg);
    // }
  });
  socket.on("join room request", (args, cb) => {
    const roomId = args
    console.log(args);
    console.log(rooms);
    const room = rooms.find((room) => room.name == roomId);
    // console.log(room, 'found room')
    if (room) {
      socket.join(room.name);
      socket.emit("chat message", room.messages);
      const filtered = rooms.filter((room) => room.name != roomId);
      rooms = [...filtered, { ...room, members: [...room.members, socket.id] }];
      io.to(room.owner).emit('connections count', room.members.length + 1)
    }
    // const roomId = args;
    // // console.log(args);
    // // console.log(rooms);
    // const roomIndex = rooms.findIndex((room) => room.name == roomId);
    // if (roomIndex > -1) {
    //   // console.log(rooms[roomIndex]);
    //   socket.join(roomId);
    //   const room = rooms[roomIndex];
    //   socket.emit("room messages", room.messages);
    // }
    cb("received");
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
