import React, { useState } from "react";
import styles from "./SendDrinks.module.css";
import giveBeer from "../../../../../assets/images/giveBeer.png";
import ModalLayout from "../../../../../layouts/ModalLayout/ModalLayout";
import { useBusDriverGameState } from "../../../../../hooks/useBussDriverGameState";

interface SendDrinksProps {
  cancelPlayCard: () => void;
  handlePlayCard: (drinks: DrinkDistributionType) => void;
}

export type DrinkDistributionType = Record<string, number>;

const SendDrinks: React.FC<SendDrinksProps> = ({
  cancelPlayCard,

  handlePlayCard,
}) => {
  const { players, gameState, player } = useBusDriverGameState();
  const { drinkAmount } = gameState;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [drinkDistribution, setDrinkDistribution] =
    useState<DrinkDistributionType>({});

  const handleSendDrinks = (): void => {
    const totalDrinks = Object.values(drinkDistribution).reduce(
      (a, b) => a + b,
      0
    );
    if (totalDrinks === drinkAmount) {
      handlePlayCard(drinkDistribution);
    } else {
      setErrorMessage(`Please distribute exactly ${drinkAmount} drinks`);
    }
  };

  const handleDrinkInputChange = (username: string, amount: number): void => {
    const totalDrinks =
      Object.values(drinkDistribution).reduce((a, b) => a + b, 0) -
      (drinkDistribution[username] || 0) +
      amount;
    if (totalDrinks <= drinkAmount) {
      setDrinkDistribution((prev) => ({
        ...prev,
        [username]: amount,
      }));
      setErrorMessage("");
    } else {
      setErrorMessage(`Total drinks cannot exceed ${drinkAmount}`);
    }
  };

  return (
    <ModalLayout onClose={cancelPlayCard}>
      <div className={styles.drinkAmount}>
        <h2>{`SEND ${drinkAmount}x`}</h2>
        <img src={giveBeer} alt="Give Beer" />
      </div>
      {errorMessage !== "" ? <p className="error">{errorMessage}</p> : null}
      <div className={styles.sendDrinks}>
        {players.map((p) => (
          <div key={p.username} className={styles.player}>
            <p
              className={`${p.username === player.username ? styles.you : ""}`}
            >
              {p.username}
              {p.username === player.username ? " - You" : ""}
            </p>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={drinkDistribution[p.username] || ""}
              onChange={(e) =>
                handleDrinkInputChange(
                  p.username,
                  parseInt(e.target.value) || 0
                )
              }
            />
          </div>
        ))}
      </div>
      <button className={styles.sendDrinkBtn} onClick={handleSendDrinks}>
        SEND
      </button>
    </ModalLayout>
  );
};

export default SendDrinks;
