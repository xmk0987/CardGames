import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../context/socket/useSocket";
import { GamePlayer, type LobbyPlayer } from "../../types/game.types";
import styles from "./Lobby.module.css";
import { games } from "../../lib/games";
import RulesPopup from "../../components/Rules/RulesPopup";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import CreateUser from "./CreateUser";

const Lobby = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const { gameName, gameId } = useParams<{
    gameName: string;
    gameId: string;
  }>();
  const [usersInLobby, setUsersInLobby] = useState<GamePlayer[]>([]);
  const [user, setUser] = useState<LobbyPlayer | null>(null);
  const [message, setMessage] = useState<string>("");
  const game = games[gameName as keyof typeof games];

  const cancelJoin = useCallback(() => {
    navigate(`/game/${gameName}`);
  }, [gameName, navigate]);

  const leaveLobby = useCallback(() => {
    if (!gameId || !user) return;

    socket.emit("leaveLobby", gameId, user);
    setUser(null);
    localStorage.removeItem("user");
    cancelJoin();
  }, [cancelJoin, gameId, socket, user]);

  useEffect(() => {
    if (!gameName || !gameId || !game) {
      navigate("/");
    }
  }, [game, gameId, gameName, navigate]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("lobbyJoined", ({ users, userData }) => {
      setUser(userData);
      setUsersInLobby(users);
      localStorage.setItem("user", JSON.stringify(userData));
    });

    socket.on("usersUpdated", ({ users }) => {
      setUsersInLobby(users);
    });

    socket.on("gameStarted", () => {
      navigate(`/game/${gameName}/${gameId}`);
    });

    socket.on("adminPromoted", ({ user }) => {
      setUser(user);
    });

    socket.on("usernameTaken", ({ message }) => {
      setMessage(message);
    });

    return () => {
      socket.off("lobbyJoined");
      socket.off("gameStarted");
      socket.off("adminPromoted");
      socket.off("usernameTaken");
      socket.off("usersUpdated");
    };
  }, [cancelJoin, gameId, gameName, navigate, socket, user]);

  if (!user) {
    return (
      <CreateUser
        message={message}
        gameId={gameId}
        cancelJoin={cancelJoin}
        setMessage={setMessage}
      />
    );
  }

  const startGame = () => {
    if (!user.isAdmin || !gameId || !gameName) return;

    socket.emit("startGame", gameId, gameName);
  };

  const isStartDisabled =
    usersInLobby.length < game.minPlayers ||
    usersInLobby.length > game.maxPlayers;

  return (
    <>
      <RulesPopup header={game.name} rules={game.rules} />
      <div className={styles.lobbyContainer}>
        <header className={styles.lobbyHeader}>
          <p>Lobby for {game.name}</p>
          <h2>{gameId}</h2>
          <div className={styles.lobbyInfo}>
            Players:
            <span className={isStartDisabled ? styles.full : ""}>
              {usersInLobby.length} / {game.maxPlayers}
            </span>
            {usersInLobby.length < game.minPlayers && (
              <span className={styles.minPlayers}>- Min {game.minPlayers}</span>
            )}
          </div>
        </header>

        <div className={styles.players}>
          {usersInLobby.map((u) => (
            <span
              key={u.id}
              className={`${styles.player} ${
                u.id === user.id ? styles.you : ""
              }`}
            >
              {u.username}
            </span>
          ))}
        </div>

        <footer className={styles.lobbyFooter}>
          {user.isAdmin && (
            <div className={styles.lobbyOptions}>
              <PrimaryButton
                text="Start"
                isDisabled={isStartDisabled}
                onClick={startGame}
              />
            </div>
          )}
          <PrimaryButton text="Leave lobby" onClick={leaveLobby} />
        </footer>
      </div>
    </>
  );
};

export default Lobby;
