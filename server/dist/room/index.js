import { v4 as uuidv4 } from "uuid";
const rooms = {};
export const roomHandler = (socket) => {
    const createRoom = () => {
        const roomId = uuidv4();
        rooms[roomId] = [];
        // TODO: save to consulta item.
        socket.emit("room-created", { roomId });
        console.log("A user created a room");
    };
    const joinRoom = ({ roomId, peerId }) => {
        socket.join(roomId);
        console.log("A user joined the room", roomId);
    };
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
};
//# sourceMappingURL=index.js.map