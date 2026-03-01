import { v4 as uuidv4 } from "uuid";
export const roomHandler = (socket) => {
    const createRoom = () => {
        const roomId = uuidv4();
        // TODO: save to consulta item.
        socket.emit("room-created", { roomId });
        console.log("A user created a room");
    };
    const joinRoom = ({ roomId }) => {
        socket.join(roomId);
        console.log("A user joined the room", roomId);
    };
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
};
//# sourceMappingURL=index.js.map