import React, { useState } from "react";
import type { GameInfo } from "../../types/game.types";
import { useNavigate } from "react-router";
import GroupIcon from "../../assets/icons/GroupIcon";
import styles from "./GameCard.module.css";
import Rules from "../Rules/Rules";

interface GameCardProps {
  game: GameInfo;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const [showRules, setShowRules] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/lobby/" + game.route);
  };

  const toggleRules = (): void => {
    setShowRules(!showRules);
  };

  return (
    <div className={styles["gameCard"]}>
      <p className={styles["gameCardHeader"]}>{game.name}</p>
      <div
        className={styles["gameCardMain"]}
        style={{ overflow: showRules ? "scroll" : "hidden" }}
      >
        {showRules ? (
          <Rules rules={game.rules} />
        ) : (
          <>
            <img src={game.image} alt={game.name.toLowerCase()} />
            <p className={styles["gameCardInfo"]}>{game.desc}</p>
          </>
        )}
      </div>
      <div className={styles["gameCardFooter"]}>
        <button
          className={styles["gameCardButton"]}
          onClick={handleNavigate}
        ></button>
        <div className={styles["gameCardRules"]}>
          <div className={styles["gameCardPlayers"]}>
            <p>
              {game.minPlayers} -{" "}
              {game.maxPlayers === Infinity ? "∞" : game.maxPlayers}
            </p>
            <GroupIcon size={20} />
          </div>
          <button
            className={styles["gameCardRuleButton"]}
            onClick={toggleRules}
          >
            {showRules ? "CLOSE RULES" : "RULES"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
