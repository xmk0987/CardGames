import React, { useEffect, useState } from "react";
import ModalLayout from "../../../../../layouts/ModalLayout/ModalLayout";
import { useRingOfFireGameState } from "../../../../../hooks/useRingOfFireGameState";
import styles from "./Mate.module.css";
import { GamePlayer } from "../../../../../types/game.types";
import { useSocket } from "../../../../../context/socket/useSocket";
import PrimaryButton from "../../../../PrimaryButton/PrimaryButton";
import Mates from "./Mates";

const Mate = () => {
  const socket = useSocket();
  const { gameState, player, players, gameId } = useRingOfFireGameState();
  const [showChooseMate, setShowChooseMate] = useState(true);

  useEffect(() => {
    if (gameState.isChoosingMate) {
      setShowChooseMate(true);
    }
  }, [gameState.isChoosingMate]);

  if (gameState.playerInTurn.id !== player.id || !gameState.isChoosingMate)
    return <Mates />;

  const isMateAlready = (mate: GamePlayer) => {
    const mates =
      gameState.mates && gameState.mates[player.id]
        ? gameState.mates[player.id]
        : [];
    return mates.some((p) => p.id === mate.id);
  };

  const handleSelectMate = (selectedPlayer: GamePlayer | null) => {
    socket.emit("playerAction", gameId, "SET_MATE", { player: selectedPlayer });
    setShowChooseMate(false);
  };

  return (
    <>
      {showChooseMate ? (
        <ModalLayout onClose={() => setShowChooseMate(false)}>
          <h2>Choose A Mate</h2>
          <div className={styles.mateList}>
            {players.filter((p) => p.id !== player.id && !isMateAlready(p))
              .length === 0 && <p>No possible mates left.</p>}
            {players
              .filter((p) => p.id !== player.id && !isMateAlready(p))
              .map((p) => (
                <PrimaryButton
                  key={p.id}
                  text={p.username}
                  onClick={() => handleSelectMate(p)}
                ></PrimaryButton>
              ))}
          </div>
          <PrimaryButton
            text={"SKIP MATE"}
            onClick={() => handleSelectMate(null)}
          ></PrimaryButton>
        </ModalLayout>
      ) : (
        <button
          className={styles.mateBtn}
          onClick={() => setShowChooseMate(true)}
        >
          Choose Mate
        </button>
      )}
    </>
  );
};

export default Mate;
