import { useEffect, useCallback } from "react";
import { useSocket } from "../../../context/socket/useSocket";
import { useHorseTrackGameState } from "../../../hooks/useHorseTrackGameState";
import LeaveGame from "../../LeaveGame/LeaveGame";
import Bets from "./components/Bets/Bets";
import Track from "./components/Track/Track";
import styles from "./HorseTrack.module.css";
import NewGame from "../../NewGame/NewGame";

const HorseTrack = () => {
  const socket = useSocket();
  const { gameState, player, gameId } = useHorseTrackGameState();

  const horsePositions = Object.values(gameState.horses).map((h) => h.position);

  const moveHorse = useCallback(() => {
    if (!player.isAdmin || gameState.status === "bets") return;
    socket.emit("playerAction", gameId, "MOVE_HORSE", {});
  }, [gameId, gameState.status, player.isAdmin, socket]);

  useEffect(() => {
    if (gameState.status !== "game" || !player.isAdmin) return;

    const timeout = setTimeout(() => {
      moveHorse();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [moveHorse, player.isAdmin, gameState.status, horsePositions]);

  return (
    <div className={styles.container}>
      <p className={styles.message}>{gameState.message}</p>
      <Bets startGame={moveHorse} />
      <Track />
      <LeaveGame />
      <NewGame />
    </div>
  );
};

export default HorseTrack;
