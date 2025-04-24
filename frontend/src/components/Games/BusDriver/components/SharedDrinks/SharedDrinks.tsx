import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./SharedDrinks.module.css";
import giveBeerImage from "../../../../../assets/images/giveBeer.png";
import PrimaryButton from "../../../../PrimaryButton/PrimaryButton";
import ModalLayout from "../../../../../layouts/ModalLayout/ModalLayout";
import { useBusDriverGameState } from "../../../../../hooks/useBussDriverGameState";

interface SharedDrinksProps {
  handleNextTurn: () => void;
}

const SharedDrinks: React.FC<SharedDrinksProps> = ({ handleNextTurn }) => {
  const { player, gameState, players } = useBusDriverGameState();
  const { drinkHistory, readyPlayers } = gameState;
  const [showDrinks, setShowDrinks] = useState<boolean>(false);
  const prevDrinkTotal = useRef<number>(0);

  // Helper to count total drinks received
  const getDrinkTotal = useCallback(() => {
    return drinkHistory
      .filter((entry) => entry.recipient === player.username)
      .reduce((sum, entry) => sum + entry.amount, 0);
  }, [drinkHistory, player.username]);

  useEffect(() => {
    const currentTotal = getDrinkTotal();

    if (currentTotal > prevDrinkTotal.current) {
      setShowDrinks(true);
    }

    prevDrinkTotal.current = currentTotal;
  }, [getDrinkTotal]);

  const isAllReady = readyPlayers.length === players.length;

  useEffect(() => {
    if (isAllReady) {
      setShowDrinks(true);
    }
  }, [isAllReady]);

  useEffect(() => {
    setShowDrinks(false);
  }, [gameState.round]);

  return (
    <>
      {showDrinks ? (
        <ModalLayout onClose={() => setShowDrinks(false)}>
          <h2>SHARED DRINKS</h2>
          <div className={styles.drinks}>
            {drinkHistory.length > 0 ? (
              drinkHistory.map((entry, index) => (
                <div key={index} className={styles.drink}>
                  <p
                    className={`${
                      entry.giver === player.username ? styles.you : ""
                    }`}
                  >
                    {entry.giver}
                    {entry.giver === player.username ? " - You" : ""}
                  </p>
                  <div className={styles.drinkAmount}>
                    <p>{entry.amount}x</p>
                    <img src={giveBeerImage} alt="give beer" />
                  </div>
                  <p
                    className={`${
                      entry.recipient === player.username ? styles.you : ""
                    }`}
                  >
                    {entry.recipient}
                    {entry.recipient === player.username ? " - You" : ""}
                  </p>
                </div>
              ))
            ) : (
              <p>No drinks shared!</p>
            )}
          </div>
          {player.isAdmin /* && isAllReady  */ && (
            <PrimaryButton text="Next Turn" onClick={handleNextTurn} />
          )}
        </ModalLayout>
      ) : (
        <button
          className={styles.showDrinks}
          onClick={() => setShowDrinks(true)}
        >
          <img src={giveBeerImage} alt="Mug of Beer"></img>
        </button>
      )}
    </>
  );
};

export default SharedDrinks;
