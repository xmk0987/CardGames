import React from "react";
import type { GamePlayer } from "../../../../../types/game.types";
import styles from "./Players.module.css";
import { useBusDriverGameState } from "../../../../../hooks/useBussDriverGameState";

interface PlayersProps {
  isReady: (player: GamePlayer) => boolean;
}

const Players: React.FC<PlayersProps> = ({ isReady }) => {
  const { players, player } = useBusDriverGameState();

  return (
    <div className={styles.players}>
      {players.map((p) => (
        <div className={styles.player} key={p.id}>
          <p
            className={`${p.username === player.username ? styles.you : ""} ${
              isReady(p) ? styles.ready : styles.notReady
            }`}
          >
            {p.username}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Players;
