import { createContext } from "react";
import { GameSocket } from "../../types/socket.types";

export const SocketContext = createContext<GameSocket | null>(null);
