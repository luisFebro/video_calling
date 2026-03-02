import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

// TODO: move to database.
// TODO should be a set instead of array to avoid duplicates.
const rooms: Record<string, Set<string>> = {};
interface IRoomParams {
    roomId: string;
    peerId: string;
}

export const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuidv4();

        rooms[roomId] = new Set();

        // TODO: save to consulta item.
        socket.emit("room-created", { roomId });

        console.log("A user created a room");
    };

    const joinRoom = ({ roomId, peerId }: IRoomParams) => {
        if (rooms[roomId]) {
            rooms[roomId].add(peerId);

            socket.join(roomId);
            socket.to(roomId).emit("user-joined", { peerId });

            socket.emit("get-users", {
                participants: Array.from(rooms[roomId]),
                roomId,
            });

            console.log("A user joined the room", roomId, peerId);
        }

        socket.on("disconnect", () => {
            console.log("A user is disconnected from the room", peerId);
            leaveRoom({ roomId, peerId });
        });
    };

    const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
        if (rooms[roomId]) {
            rooms[roomId].delete(peerId);
            socket.to(roomId).emit("user-disconnected", peerId);
        }

        //     if (rooms[roomId].size === 0) {
        //         delete rooms[roomId];
        //     }
        // }
    };

    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
};
