// lib/socket.ts
import { io } from "socket.io-client";
import { GameSocket } from "../types/socket.types";
import { SERVER_URL } from "./server";

const URL = SERVER_URL;

if (!URL) {
  throw new Error("Missing configuration");
}

export const socket: GameSocket = io(URL, {
  autoConnect: false,
});
