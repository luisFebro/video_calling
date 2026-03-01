// import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { roomHandler } from "./room/index.js";
const port = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "*",
    },
});
io.on("connection", (socket) => {
    console.log("A user is connected");
    roomHandler(socket);
    socket.on("disconnect", () => {
        console.log("A user is disconnected");
    });
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map