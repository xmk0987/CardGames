import { useState } from "react";
import styles from "./LeaveGame.module.css";
import ModalLayout from "../../layouts/ModalLayout/ModalLayout";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { useGameState } from "../../context/gameState/useGameState";

const LeaveGame = () => {
  const { leaveGame } = useGameState();
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  return (
    <>
      {showConfirmLeave ? (
        <ModalLayout onClose={() => setShowConfirmLeave(false)}>
          <p>Are you sure you want to leave the game?</p>
          <PrimaryButton onClick={() => leaveGame()} text="Yes" />
          <PrimaryButton onClick={() => setShowConfirmLeave(false)} text="No" />
        </ModalLayout>
      ) : (
        <button
          className={styles.leaveGame}
          onClick={() => setShowConfirmLeave(true)}
        >
          Leave Game
        </button>
      )}
    </>
  );
};

export default LeaveGame;
