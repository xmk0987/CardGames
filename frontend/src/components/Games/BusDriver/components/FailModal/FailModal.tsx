import React, { useEffect, useState } from "react";
import styles from "./FailModal.module.css";
import PrimaryButton from "../../../../PrimaryButton/PrimaryButton";
import ModalLayout from "../../../../../layouts/ModalLayout/ModalLayout";
import { useBusDriverGameState } from "../../../../../hooks/useBussDriverGameState";

interface FailModalProps {
  isBusDriver: boolean;
  resetBonusRound: () => void;
}

const FailModal: React.FC<FailModalProps> = ({
  isBusDriver,
  resetBonusRound,
}) => {
  const { gameState } = useBusDriverGameState();
  const [showFailModal, setShowFailModal] = useState<boolean>(false);

  useEffect(() => {
    if (gameState.failedBonus) {
      setShowFailModal(true);
    } else {
      setShowFailModal(false);
    }
  }, [gameState.failedBonus]);

  return (
    <>
      {showFailModal ? (
        <ModalLayout onClose={() => setShowFailModal(false)}>
          <h2>FAILED</h2>
          {gameState.message}
          {isBusDriver && (
            <PrimaryButton text="GO AGAIN" onClick={resetBonusRound} />
          )}
        </ModalLayout>
      ) : (
        <button
          className={styles.showDrinks}
          onClick={() => setShowFailModal(true)}
        >
          BONUS
        </button>
      )}
    </>
  );
};

export default FailModal;
