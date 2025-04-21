import React, { useEffect, useState } from "react";
import styles from "./NewGame.module.css";
import { useGameState } from "../../../../../context/gameState/useGameState";
import PrimaryButton from "../../../../PrimaryButton/PrimaryButton";
import CloseIcon from "../../../../../assets/icons/CloseIcon";
import ModalLayout from "../../../../../layouts/ModalLayout/ModalLayout";

interface NewGameProps {
  resetGame: () => void;
  leaveGame: () => void;
}

const NewGame: React.FC<NewGameProps> = ({ resetGame, leaveGame }) => {
  const { gameState, player } = useGameState();
  const [showNewGame, setShowNewGame] = useState<boolean>(false);

  useEffect(() => {
    if (gameState.status === "finished") {
      setShowNewGame(true);
    } else {
      setShowNewGame(false);
    }
  }, [gameState.status]);

  return (
    <>
      {showNewGame ? (
        <ModalLayout onClose={() => setShowNewGame(false)}>
          <button
            className={styles.close}
            onClick={() => setShowNewGame(false)}
          >
            <CloseIcon size={25} />
          </button>
          <h2>GAME FINISHED</h2>
          <p>{gameState.message}</p>
          <p>Wait for admin to start a new game or leave game.</p>
          {player.isAdmin && (
            <PrimaryButton text="GO AGAIN" onClick={resetGame} />
          )}
          <PrimaryButton text="LEAVE GAME" onClick={leaveGame} />
        </ModalLayout>
      ) : (
        <button
          className={styles.showDrinks}
          onClick={() => setShowNewGame(true)}
        >
          NEW GAME
        </button>
      )}
    </>
  );
};

export default NewGame;
