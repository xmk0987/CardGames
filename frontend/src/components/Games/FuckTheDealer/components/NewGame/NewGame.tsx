import { useEffect, useState } from "react";
import styles from "./NewGame.module.css";
import PrimaryButton from "../../../../PrimaryButton/PrimaryButton";
import ModalLayout from "../../../../../layouts/ModalLayout/ModalLayout";
import { useFuckTheDealerGameState } from "../../../../../hooks/useFuckTheDealerGameState";

const NewGame = () => {
  const { gameState, player, resetGame, leaveGame } =
    useFuckTheDealerGameState();
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
