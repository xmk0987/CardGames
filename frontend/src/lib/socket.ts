// lib/socket.ts
import { io } from "socket.io-client";
import { GameSocket } from "../types/socket.types";

const URL = import.meta.env.SERVER_URL || "http://localhost:8888";

export const socket: GameSocket = io(URL, {
  autoConnect: true,
});
