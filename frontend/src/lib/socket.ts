// lib/socket.ts
import { io } from "socket.io-client";
import { GameSocket } from "../types/socket.types";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8888";

export const socket: GameSocket = io(URL, {
  autoConnect: false,
});
