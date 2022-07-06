const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const {
  createRoomForUser,
  joinAndUpdateRooms,
  updateMessageInRoom,
  getPrimaryRoom,
  getRoomByNameOrId,
  removeRoom,
  removeSocketFromRoom,
  checkIfSelfConnection,
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
    console.log({ socketId: socket.id, roomId: args });
    if (checkIfSelfConnection(args, socket.id)) {
      socket.emit("selfJoinError");
      return;
    }
    let roomToJoin = getRoomByNameOrId(args);
    if (!roomToJoin) {
      console.log("room not found");
      return;
    }
    const room = joinAndUpdateRooms(args, socket.id);
    // console.log(room, 'room to join')
    if (room) {
      // Join the socket to the host room
      socket.join(room.name);

      const primaryRoom = getPrimaryRoom(socket.id);

      // Leave the primary room joined during socket creation
      // This ensures that no one could connect to a socket
      // that is already connected to some other host
      if (primaryRoom) {
        removeRoom(primaryRoom.id);
        socket.leave(primaryRoom.id);
        io.in(primaryRoom.id).socketsLeave(primaryRoom.id);
      }
      // Send the host a notification
      io.to(room.owner).emit("new connection", {
        connections: room.members.length,
        messages: room.messages,
        roomId: room.id || room.name,
        room,
      });
      // Callback to send old messages to client
      cb(room.messages || []);
    } else {
      console.log("room not found");
    }
    socket.on("leaveRoom", (roomId) => {
      const room = removeSocketFromRoom(roomId, socket.id);
      console.log({ room });
      socket.emit("socketDisconnected");
      socket.leave(roomId);
    });
  });

  // Placing this listener out inorder to broadcast the host
  // message. TODO: not sure if this is the only way
  socket.on("chat message", ({ msg, roomId }) => {
    // console.log({ msg, roomId });
    const { room, message } = updateMessageInRoom(roomId, msg);
    if (room) {
      io.to(roomId).emit("chat message", message);
      console.log("message emitted", message);
    }
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
