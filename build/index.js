"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
require("dotenv/config");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => {
    socket.on("client-ready", () => {
        socket.broadcast.emit("get-canvas-state");
    });
    socket.on("canvas-state", (state) => {
        console.log("received canvas state");
        socket.broadcast.emit("canvas-state-from-server", state);
    });
    socket.on("draw-line", ({ prevPoint, currentPoint, color }) => {
        socket.broadcast.emit("draw-line", { prevPoint, currentPoint, color });
    });
    socket.on("clear", () => io.emit("clear"));
});
server.listen(process.env.PORT, () => {
    console.log("✔️ Server listening on port 3001");
});
