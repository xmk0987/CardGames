import styles from "./Pyramid.module.css";
import { useBusDriverGameState } from "../../../../../hooks/useBussDriverGameState";
import { BACK_OF_CARD } from "../../../../../lib/cardImages";

const Pyramid = () => {
  const { gameState } = useBusDriverGameState();
  const { pyramid, turnedCards } = gameState;

  const totalRows: number = 5;

  const isTurned = (cardCode: string) => {
    return turnedCards
      ? Object.prototype.hasOwnProperty.call(turnedCards, cardCode)
      : false;
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
            <img
              src={isTurned(card.code) ? card.image : BACK_OF_CARD}
              alt={card.code}
            />
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
        <p>{2 * row + 2}x</p>
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

export default Pyramid;
