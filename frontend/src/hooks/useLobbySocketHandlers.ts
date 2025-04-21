import { useEffect } from "react";
import type { LobbyPlayer } from "../types/game.types";
import type { GameSocket, ServerToClientEvents } from "../types/socket.types";

interface Props {
  socket: GameSocket;
  gameId?: string;
  gameName?: string;
  navigate: (path: string) => void;
  setUserData: (data: LobbyPlayer | null) => void;
  setUsersInLobby: (users: LobbyPlayer[]) => void;
  initializeLobby: () => void;
  hasJoinedLobby: React.MutableRefObject<boolean>;
}

export const useLobbySocketHandlers = ({
  socket,
  gameId,
  gameName,
  navigate,
  setUserData,
  setUsersInLobby,
  initializeLobby,
  hasJoinedLobby,
}: Props) => {
  useEffect(() => {
    if (!socket || !gameId) {
      return;
    }

    const handleLobbyJoined = (
      data: Parameters<ServerToClientEvents["lobbyJoined"]>[0]
    ) => {
      setUsersInLobby(data.users);
      setUserData(data.userData);
      localStorage.setItem("userData", JSON.stringify(data.userData));
    };

    const handleUsersUpdated = (
      data: Parameters<ServerToClientEvents["usersUpdated"]>[0]
    ) => {
      setUsersInLobby(data.users);
    };

    const handleUsernameTaken = (
      data: Parameters<ServerToClientEvents["usernameTaken"]>[0]
    ) => {
      alert(data.message);
      const newUsername = prompt("Username taken. Enter a different username:");
      if (!newUsername || !gameId) return;

      const newUser: LobbyPlayer = {
        id: Math.random().toString(16).slice(2),
        username: newUsername.trim(),
        gameId,
        socketId: socket.id,
        isAdmin: false,
      };

      setUserData(newUser);
      localStorage.setItem("userData", JSON.stringify(newUser));

      // 🟢 Prevent initializeLobby from running again
      hasJoinedLobby.current = true;

      socket.emit("joinLobby", gameId, newUser);
    };

    const handleAdminPromoted = (
      data: Parameters<ServerToClientEvents["adminPromoted"]>[0]
    ) => {
      setUserData(data.user);
      localStorage.setItem("userData", JSON.stringify(data.user));
    };

    const handleGameStarted = () => {
      if (gameName && gameId) {
        navigate(`/game/${gameName}/${gameId}`);
      }
    };

    socket.on("lobbyJoined", handleLobbyJoined);
    socket.on("usersUpdated", handleUsersUpdated);
    socket.on("usernameTaken", handleUsernameTaken);
    socket.on("adminPromoted", handleAdminPromoted);
    socket.on("gameStarted", handleGameStarted);

    return () => {
      socket.off("lobbyJoined", handleLobbyJoined);
      socket.off("usersUpdated", handleUsersUpdated);
      socket.off("usernameTaken", handleUsernameTaken);
      socket.off("adminPromoted", handleAdminPromoted);
      socket.off("gameStarted", handleGameStarted);
    };
  }, [
    socket,
    gameId,
    gameName,
    navigate,
    setUserData,
    setUsersInLobby,
    initializeLobby,
    hasJoinedLobby,
  ]);
};
