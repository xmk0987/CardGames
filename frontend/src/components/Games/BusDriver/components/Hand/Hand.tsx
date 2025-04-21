import React, { useMemo } from "react";
import type { Card } from "../../../../../types/game.types";
import styles from "./Hand.module.css";
import { checkIfEqual } from "../../../../../utils/helpers";
import { groupCardsByValue } from "../../../../../utils/helpers";
import { useGameState } from "../../../../../context/gameState/useGameState";

interface HandProps {
  isReady: boolean;
  handlePlayCard: (card: Card) => void;
  handlePlayerReady: () => void;
}

const Hand: React.FC<HandProps> = ({
  isReady,
  handlePlayCard,
  handlePlayerReady,
}) => {
  const { gameState, player } = useGameState();
  const { playerCards, turnedCards } = gameState;

  const hand = useMemo(
    () => groupCardsByValue(playerCards[player.username]),
    [playerCards, player.username]
  );

  const getLastTurnedCard = () => {
    const keys = Object.keys(turnedCards);
    return keys.length ? keys[keys.length - 1] : null;
  };

  const lastTurnedCard = getLastTurnedCard();

  return (
    <>
      <section className={styles.handContainer}>
        <div className={styles.hand}>
          {Object.entries(hand).map(([, cards]) =>
            cards.map((card) => (
              <button
                key={card.code}
                className={`${
                  checkIfEqual(card.code, lastTurnedCard) ? "" : styles.masked
                }`}
                disabled={!checkIfEqual(card.code, lastTurnedCard)}
                onClick={() => handlePlayCard(card)}
              >
                <img src={card.image} alt={card.code} />
              </button>
            ))
          )}
        </div>
        <div
          className={`${styles.options} ${
            isReady ? styles.ready : styles.notReady
          }`}
        >
          <button onClick={handlePlayerReady}>
            {isReady ? "Ready" : "Ready?"}
          </button>
        </div>
      </section>
    </>
  );
};

export default Hand;
