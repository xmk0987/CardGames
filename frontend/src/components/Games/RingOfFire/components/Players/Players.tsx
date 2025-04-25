import styles from "./Players.module.css";
import { GamePlayer } from "../../../../../types/game.types";
import { useRingOfFireGameState } from "../../../../../hooks/useRingOfFireGameState";
import React from "react";

const Players = () => {
  const { players, gameState, isYou } = useRingOfFireGameState();

  const isInTurn = (p: GamePlayer) => {
    return gameState.playerInTurn?.id === p.id;
  };

  const isQuestionMaster = (p: GamePlayer) => {
    return gameState.questionMaster?.id === p.id;
  };

  return (
    <div className={styles.container}>
      {players.map((p) => (
        <div className={`${styles.player}`} key={p.id}>
          <span
            className={`${styles.playerName} ${isYou(p) ? styles.you : ""}`}
          >
            {p.username}
          </span>
          {gameState.status === "game" && (
            <>
              {isInTurn(p) && <span className={styles.dealer}>Turn</span>}
              {isQuestionMaster(p) && (
                <span className={styles.guesser}>QM</span>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Players;
