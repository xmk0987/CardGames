/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useFuckTheDealerGameState } from "../../../hooks/useFuckTheDealerGameState";
import ChooseCards from "./components/ChooseCards/ChooseCards";
import DealerCard from "./components/DealerCard/DealerCard";
import Players from "./components/Players/Players";
import TurnedCards from "./components/TurnedCards/TurnedCards";
import styles from "./FuckTheDealer.module.css";
import { useSocket } from "../../../context/socket/useSocket";
import MessagePopup from "./components/MessagePopup/MessagePopup";
import LeaveGame from "../../LeaveGame/LeaveGame";
import NewGame from "../../NewGame/NewGame";

const FuckTheDealer = () => {
  const socket = useSocket();
  const { gameState, player, gameId } = useFuckTheDealerGameState();
  const [loading, setLoading] = useState<boolean>(false);

  const handleGuessCard = (index: number) => {
    if (loading || gameState.status === "finished") return;

    const cardValue = index + 1;

    setLoading(true);
    const data = {
      cardValue,
    };

    socket.emit(
      "playerAction",
      gameId,
      "PLAY_CARD",
      data,
      (_res: { success: boolean }) => {
        setLoading(false);
      }
    );
  };

  return (
    <div className={styles.container}>
      {gameState.status === "game" && (
        <>
          <LeaveGame/>
          <MessagePopup />
        </>
      )}
      <Players />
      <TurnedCards />
      {gameState.guesser.id === player.id && (
        <ChooseCards handleGuessCard={handleGuessCard} />
      )}
      {gameState.dealer.id === player.id && <DealerCard />}
      <NewGame />
    </div>
  );
};

export default FuckTheDealer;
