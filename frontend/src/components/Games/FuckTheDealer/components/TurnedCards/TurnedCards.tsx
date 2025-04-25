import { useFuckTheDealerGameState } from "../../../../../hooks/useFuckTheDealerGameState";
import styles from "./TurnedCards.module.css";
import { mapCardValueToNumber } from "../../../../../utils/helpers";
import React from "react";

const TurnedCards = () => {
  const { gameState } = useFuckTheDealerGameState();

  const sortedUsedCardEntries = gameState.usedCards
    ? Object.entries(gameState.usedCards).sort(
        ([a], [b]) => mapCardValueToNumber(a) - mapCardValueToNumber(b)
      )
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Used Cards</span>
        <span>Cards left: {gameState.cardsLeft}</span>
      </div>

      <div className={styles.cardStacks}>
        {sortedUsedCardEntries.map(([cardValue, cards]) => (
          <div key={cardValue} className={styles.cardStack}>
            {cards.map((card, index) => (
              <img
                key={card.code + index}
                src={card.image}
                alt={`${card.value} of ${card.suit}`}
                className={styles.card}
                style={{ top: `${index * 10}px`, zIndex: index }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TurnedCards;
