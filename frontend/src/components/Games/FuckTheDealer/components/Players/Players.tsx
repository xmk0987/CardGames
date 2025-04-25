import { useFuckTheDealerGameState } from "../../../../../hooks/useFuckTheDealerGameState";
import styles from "./Players.module.css";
import { GamePlayer } from "../../../../../types/game.types";
import React from "react";

const Players = () => {
  const { players, player, gameState } = useFuckTheDealerGameState();

  const isDealer = (p: GamePlayer) => {
    return gameState.dealer.id === p.id;
  };

  const isGuesser = (p: GamePlayer) => {
    return gameState.guesser.id === p.id;
  };

  return (
    <div className={styles.container}>
      {players.map((p) => (
        <div className={`${styles.player}`} key={p.id}>
          <span
            className={`${styles.playerName} ${
              p.id === player.id ? styles.you : ""
            }`}
          >
            {p.username}
          </span>
          {gameState.status === "game" && (
            <>
              {isDealer(p) && (
                <>
                  <span className={styles.dealer}>Dealer</span>
                  <span className={styles.dealer}>{gameState.dealerTurn}</span>
                </>
              )}
              {isGuesser(p) && <span className={styles.guesser}>Guesser</span>}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Players;
