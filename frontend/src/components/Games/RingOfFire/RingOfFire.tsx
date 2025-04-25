import React from "react";
import { useRingOfFireGameState } from "../../../hooks/useRingOfFireGameState";
import Players from "./components/Players/Players";
import styles from "./RingOfFire.module.css";
import Deck from "./components/Deck/Deck";
import Mate from "./components/Mate/Mate";
import LeaveGame from "../../LeaveGame/LeaveGame";
import NewGame from "../../NewGame/NewGame";

const RingOfFire: React.FC = () => {
  const { gameState } = useRingOfFireGameState();

  return (
    <div className={styles.container}>
      <LeaveGame/>
      <NewGame />
      {gameState.message !== "" && <p>{gameState.message}</p>}
      <Mate />
      <Players />
      <Deck />
    </div>
  );
};

export default RingOfFire;
