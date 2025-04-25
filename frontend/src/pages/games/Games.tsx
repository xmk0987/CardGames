import styles from "./Games.module.css";
import GameCard from "../../components/GameCard/GameCard";
import { games } from "../../lib/games";

const Games = () => {
  return (
    <div className={styles.container}>
      {Object.values(games).map((game, index) => (
        <GameCard key={index} game={game} />
      ))}
    </div>
  );
};

export default Games;
