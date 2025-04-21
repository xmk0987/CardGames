import BussDriver from "../../components/Games/BussDriver/BussDriver";
import RulesPopup from "../../components/Rules/RulesPopup";
import { useGameState } from "../../context/gameState/useGameState";
import styles from "./GameRouter.module.css";

const GameRouter = () => {
  const { gameInfo } = useGameState();

  const renderGameComponent = () => {
    switch (gameInfo.route) {
      case "bussDriver":
        return <BussDriver />;
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
