import styles from "./ChooseCards.module.css";
import { cardsBySuit } from "../../../../../lib/cardImages";
import { useFuckTheDealerGameState } from "../../../../../hooks/useFuckTheDealerGameState";
import { mapNumberToCardValue } from "../../../../../utils/helpers";

interface ChooseCardsProps {
  handleGuessCard: (index: number) => void;
}

const ChooseCards: React.FC<ChooseCardsProps> = ({ handleGuessCard }) => {
  const { gameState } = useFuckTheDealerGameState();

  const isPossible = (cardValue: number) => {
    const { currentGuess, usedCards, isSmallerOrBigger } = gameState;

    if (usedCards && usedCards[mapNumberToCardValue(cardValue)]?.length === 4) {
      return false;
    }

    if (!currentGuess) {
      return true;
    }

    return isSmallerOrBigger === "bigger"
      ? cardValue > currentGuess
      : isSmallerOrBigger === "smaller"
      ? cardValue < currentGuess
      : true;
  };

  return (
    <div className={styles.container}>
      <span className={styles.header}>Guess the card value</span>
      <div className={styles.cards}>
        {cardsBySuit.H.map((card, index) => {
          return (
            <button
              key={index}
              onClick={() => handleGuessCard(index)}
              className={`${!isPossible(index + 1) ? "masked" : ""}`}
              disabled={!isPossible(index + 1)}
            >
              <img src={card} alt="card"></img>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChooseCards;
