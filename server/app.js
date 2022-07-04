const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const {
  createRoomForUser,
  joinAndUpdateRooms,
  updateMessageInRoom,
} = require("./rooms");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connection log");
  const roomId = createRoomForUser(socket.id);
  // Creating and joining a room for every unique connection
  socket.join(roomId);
  setTimeout(() => {
    socket.emit("sessionId", roomId);
  }, 3000);

  socket.on("joinRoom", (args, cb) => {
    const room = joinAndUpdateRooms(args, socket.id);
    // console.log(room, 'room to join')
    if (room) {
      // Join the socket to the host room
      socket.join(room.name);

      // Send the host a notification
      io.to(room.owner).emit("new connection", {
        connections: room.members.length,
        messages: room.messages,
      });
      // Callback to send old messages to client
      cb(room.messages || []);
    }
    socket.on("chat message", ({ msg, roomId }) => {
      console.log({ room, roomId, socketId: socket.id });
      if (room && room.id === roomId) {
        updateMessageInRoom(roomId, msg);
        io.to(roomId).emit("chat message", msg);
      }
    });
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
