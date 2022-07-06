const ShortUniqueId = require("short-unique-id");
const { isLink } = require("./utils");

let rooms = [];
const uuid = new ShortUniqueId({
  length: 6,
});

const getRoomByIdAndRemainingRooms = (id, key = "name") => {
  const data = rooms.reduce(
    (acc, curr) => {
      if (curr[key] === id) {
        acc.room = curr;
      } else {
        acc.otherRooms.push(curr);
      }
      return acc;
    },
    { room: {}, otherRooms: [] }
  );
  return data;
};

const formatMessage = (message) => ({
  message,
  type: isLink(message) ? "link" : "text",
});

module.exports = {
  createRoomForUser: (socketId) => {
    const id = uuid();
    const data = {
      id,
      name: id,
      owner: socketId,
      members: [socketId],
      messages: [],
    };
    rooms.push(data);
    // console.log(rooms);
    return id;
  },

  joinAndUpdateRooms: (roomId, socketId) => {
    const data = getRoomByIdAndRemainingRooms(roomId);
    rooms = [
      ...data.otherRooms,
      { ...data.room, members: [...data.room.members, socketId] },
    ];
    return data.room;
  },

  getRoomByNameOrId: (roomId) => rooms.find((room) => room.name === roomId),
  updateMessageInRoom: (roomId, message) => {
    const data = getRoomByIdAndRemainingRooms(roomId);
    let room = data.room;
    const formatted = formatMessage(message);
    room.messages = [...room.messages, formatted];
    rooms = [...data.otherRooms, room];
    return { room: data.room, message: formatted };
  },
  getPrimaryRoom: (socketId) => {
    const data = getRoomByIdAndRemainingRooms(socketId, "owner");
    return data?.room;
  },
  removeRoom: (roomId) => {
    const filtered = rooms.filter((room) => room.id !== roomId);
    rooms = filtered;
  },
  removeSocketFromRoom: (roomId, socketId) => {
    const data = getRoomByIdAndRemainingRooms(roomId);
    if (data.room) {
      let updated = { ...data.room };
      const updatedMembers = data.room.members.filter(
        (member) => member !== socketId
      );
      updated.members = updatedMembers;
      rooms = [...data.otherRooms, updated];
      return updated;
    }
  },
  checkIfSelfConnection: (roomId, socketId) => {
    const room = rooms.find(room => room.id === roomId)
    if (!room) return true;
    return room.owner === socketId

  },
  formatMessage,
};
