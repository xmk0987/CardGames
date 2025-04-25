import BusDriver from "../../components/Games/BusDriver/BusDriver";
import FuckTheDealer from "../../components/Games/FuckTheDealer/FuckTheDealer";
import HorseTrack from "../../components/Games/HorseTrack/HorseTrack";
import RingOfFire from "../../components/Games/RingOfFire/RingOfFire";
import RulesPopup from "../../components/Rules/RulesPopup";
import { useGameState } from "../../context/gameState/useGameState";
import styles from "./GameRouter.module.css";
import React from "react";

const GameRouter = () => {
  const { gameInfo } = useGameState();

  const renderGameComponent = () => {
    switch (gameInfo.route) {
      case "busDriver":
        return <BusDriver />;
      case "fuckTheDealer":
        return <FuckTheDealer />;
      case "ringOfFire":
        return <RingOfFire />;
      case "horseTrack":
        return <HorseTrack />;
      default:
        return <div>Game not found</div>;
    }
  };

  return (
    <div className={styles.container}>
      <RulesPopup header={gameInfo.name} rules={gameInfo.rules} />
      <main className={styles.main}>{renderGameComponent()}</main>
    </div>
  );
};

export default GameRouter;
