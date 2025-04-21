import { Socket } from "socket.io-client";
import type {
  BUSDRIVER_GAME_ACTIONS,
  BussDriverGameState,
  GamePlayer,
  LobbyPlayer,
} from "./game.types";

export interface ServerToClientEvents {
  usersUpdated: (data: { users: LobbyPlayer[] }) => void;
  lobbyJoined: (data: {
    users: LobbyPlayer[];
    message: string;
    userData: LobbyPlayer;
  }) => void;
  reconnectSuccess: (data: { player: LobbyPlayer }) => void;
  reconnectFailed: (data: { message: string }) => void;
  usernameTaken: (data: { message: string }) => void;
  lobbyFull: (data: { message: string }) => void;
  adminPromoted: (data: { message: string; user: LobbyPlayer }) => void;
  gameStarted: () => void;
  stateUpdated: (gameState: BussDriverGameState) => void;
  playerLeft: (data: { playerId: string }) => void;

  // BusDriver actions
}

export interface ClientToServerEvents {
  joinLobby: (gameId: string, userData: LobbyPlayer) => void;
  leaveLobby: (gameId: string, userData: LobbyPlayer) => void;
  reconnectLobby: (gameId: string, userData: LobbyPlayer) => void;
  startGame: (gameId: string, gameCode: string) => void;
  startNextTurn: (gameId: string) => void;
  leaveGame: (
    gameId: string,
    userData: GamePlayer,
    callback?: (response: { success: boolean }) => void
  ) => void;
  playerAction: (
    gameId: string,
    action: BUSDRIVER_GAME_ACTIONS,
    data?: unknown,
    callback?: (response: { success: boolean }) => void
  ) => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
