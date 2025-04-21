import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { games } from "../../lib/games";
import styles from "./Lobby.module.css";
import { useSocket } from "../../context/socket/useSocket";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import RulesPopup from "../../components/Rules/RulesPopup";
import type { LobbyPlayer } from "../../types/game.types";
import { useLobbySocketHandlers } from "../../hooks/useLobbySocketHandlers";

const Lobby = () => {
  const { gameName, gameId } = useParams<{
    gameName: string;
    gameId: string;
  }>();
  const socket = useSocket();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<LobbyPlayer | null>(null);
  const [usersInLobby, setUsersInLobby] = useState<LobbyPlayer[]>([]);
  const isNavigating = useRef(false);
  const hasJoinedLobby = useRef(false);

  const game = games[gameName as keyof typeof games];

  const promptUsername = () => {
    const newUsername = prompt("Enter your username:");
    return newUsername?.trim() || null;
  };

  const initializeLobby = useCallback(() => {
    if (!socket || !gameId || hasJoinedLobby.current) return;

    let user: LobbyPlayer | null = null;
    const stored = localStorage.getItem("userData");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.gameId === gameId) {
          user = { ...parsed, socketId: socket.id };
        }
      } catch {
        user = null;
      }
    }

    if (!user) {
      const username = promptUsername();
      if (!username) return;

      user = {
        id: Math.random().toString(16).slice(2),
        username,
        gameId,
        socketId: socket.id,
        isAdmin: false,
      };
    }

    setUserData(user);
    localStorage.setItem("userData", JSON.stringify(user));
    socket.emit("joinLobby", gameId, user);
    hasJoinedLobby.current = true;
  }, [socket, gameId]);

  useLobbySocketHandlers({
    socket,
    gameId,
    gameName,
    setUserData,
    setUsersInLobby,
    navigate,
    initializeLobby,
    hasJoinedLobby,
  });

  useEffect(() => {
    if (isNavigating.current) {
      isNavigating.current = false;
      return;
    }

    if (userData === null) {
      initializeLobby();
    }
  }, [initializeLobby, userData]);

  const startGame = () => {
    if (!socket || !gameId || !userData) return;
    socket.emit("startGame", gameId, game.route);
  };

  const handleLeaveLobby = () => {
    if (!socket || !userData || !gameId) return;

    isNavigating.current = true;
    socket.emit("leaveLobby", gameId, userData);
    localStorage.removeItem("userData");
    setUserData(null);
    navigate(`/lobby/${gameName}`);
  };

  if (!game || !gameId || !userData) {
    return <div className={styles.container}>Joining lobby here ...</div>;
  }

  return (
    <>
      <RulesPopup header={game.name} rules={game.rules} />
      <div className={styles.lobbyContainer}>
        <div className={styles.lobbyHeader}>
          <p>Lobby for {game.name}</p>
          <h2>{gameId}</h2>
          <div className={styles.lobbyInfo}>
            Players:
            <span
              className={
                usersInLobby.length >= game.maxPlayers ||
                usersInLobby.length < game.minPlayers
                  ? styles.full
                  : ""
              }
            >
              {usersInLobby.length} / {game.maxPlayers}
            </span>
            {usersInLobby.length < game.minPlayers && (
              <span className={styles.minPlayers}>- Min {game.minPlayers}</span>
            )}
          </div>
        </div>
        <div className={styles.players}>
          {usersInLobby.map((user) => (
            <span
              key={user.id}
              className={`${styles.player} ${
                user.id === userData.id ? styles.you : ""
              }`}
            >
              {user.username}
            </span>
          ))}
        </div>
        <div className={styles.lobbyFooter}>
          {userData.isAdmin && (
            <div className={styles.lobbyOptions}>
              <PrimaryButton
                text="Start"
                isDisabled={
                  usersInLobby.length >= game.maxPlayers ||
                  usersInLobby.length < game.minPlayers
                }
                onClick={startGame}
              />
            </div>
          )}
          <PrimaryButton text="Leave lobby" onClick={handleLeaveLobby} />
        </div>
      </div>
    </>
  );
};

export default Lobby;
