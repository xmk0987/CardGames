import { useRingOfFireGameState } from "../../../../../hooks/useRingOfFireGameState";
import styles from "./Deck.module.css";
import { BACK_OF_CARD } from "../../../../../lib/cardImages";
import { useSocket } from "../../../../../context/socket/useSocket";
import React from "react";

const Deck = () => {
  const { gameState, player, gameId } = useRingOfFireGameState();
  const socket = useSocket();

  const handleCardClick = () => {
    if (gameState.isChoosingMate) return;
    
    socket.emit("playerAction", gameId, "PLAY_CARD");
  };

  const isPlayerTurn = gameState.playerInTurn?.id === player.id;

  return (
    <div className={styles.wrapper}>
      <p className={styles.cardsLeft}>Cards left: {gameState.cardsLeft}</p>
      {gameState.cardsLeft > 0 && (
        <button
          className={styles.card}
          onClick={handleCardClick}
          disabled={!isPlayerTurn || gameState.isChoosingMate}
        >
          <img src={BACK_OF_CARD} alt="Deck of cards" />
        </button>
      )}
      {gameState.currentCard && (
        <div className={styles.card}>
          <img
            src={gameState.currentCard.image}
            alt={`${gameState.currentCard.code} card turned`}
          />
        </div>
      )}
    </div>
  );
};

export default Deck;
