import BusDriver from "../../components/Games/BusDriver/BusDriver";
import FuckTheDealer from "../../components/Games/FuckTheDealer/FuckTheDealer";
import RingOfFire from "../../components/Games/RingOfFire/RingOfFire";
import RulesPopup from "../../components/Rules/RulesPopup";
import { useGameState } from "../../context/gameState/useGameState";
import styles from "./GameRouter.module.css";

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
