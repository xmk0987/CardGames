import { useState } from "react";
import styles from "./NewGame.module.css";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import ModalLayout from "../../layouts/ModalLayout/ModalLayout";
import { useGameState } from "../../context/gameState/useGameState";

const NewGame = () => {
  const { gameState, player, resetGame, leaveGame } = useGameState();
  const [showNewGame, setShowNewGame] = useState<boolean>(false);

  if (gameState.status !== "finished") return null;

  return (
    <>
      {showNewGame ? (
        <ModalLayout onClose={() => setShowNewGame(false)}>
          <h2>GAME FINISHED</h2>
          {gameState.message !== "" && <p>{gameState.message}</p>}
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
