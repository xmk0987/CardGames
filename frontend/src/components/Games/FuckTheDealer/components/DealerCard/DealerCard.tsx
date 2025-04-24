import { useFuckTheDealerGameState } from "../../../../../hooks/useFuckTheDealerGameState";
import styles from "./DealerCard.module.css";

const DealerCard = () => {
  const { gameState } = useFuckTheDealerGameState();

  return (
    <div className={styles.container}>
      <span className={styles.header}>Turned card</span>
      <img src={gameState.currentCard.image}></img>
    </div>
  );
};

export default DealerCard;
