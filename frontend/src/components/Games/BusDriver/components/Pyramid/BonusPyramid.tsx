import styles from "./Pyramid.module.css";
import { useGameState } from "../../../../../context/gameState/useGameState";
import { Card } from "../../../../../types/game.types";

interface BonusPyramidProps {
  playBonusCard: (card: Card) => void;
  isBusDriver: boolean;
}

const BonusPyramid: React.FC<BonusPyramidProps> = ({
  playBonusCard,
  isBusDriver,
}) => {
  const { gameState } = useGameState();
  const { pyramid, turnedCards } = gameState;

  const totalRows: number = 5;

  const isTurned = (cardCode: string) => {
    return turnedCards
      ? Object.prototype.hasOwnProperty.call(turnedCards, cardCode)
      : false;
  };

  const isRowOpen = (row: number) => {
    return gameState.round - 1 === row && isBusDriver && !gameState.failedBonus;
  };

  let cardIndex = 0;
  const rows = Array.from({ length: totalRows }, (_, i) => {
    const row = i;
    const cards = Array.from({ length: totalRows - row }, () => {
      if (cardIndex < pyramid.length) {
        const card = pyramid[cardIndex];
        cardIndex++;
        return (
          <div className={styles.pyramid} key={cardIndex}>
            <button
              disabled={!isRowOpen(row)}
              onClick={() => playBonusCard(card)}
            >
              <img
                src={
                  isTurned(card.code)
                    ? card.image
                    : "https://deckofcardsapi.com/static/img/back.png"
                }
                alt={card.code}
              />
            </button>
            {isTurned(card.code) &&
              turnedCards[card.code].map((playedCard) => (
                <img
                  key={playedCard.code}
                  src={playedCard.image}
                  alt={playedCard.code}
                />
              ))}
          </div>
        );
      }
      return null;
    }).reverse();
    return (
      <div className={styles.pyramidRow} key={row}>
        <p>{row + 1}x</p>
        {cards}
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.pyramidContainer}>{rows.reverse()}</div>
    </div>
  );
};

export default BonusPyramid;
