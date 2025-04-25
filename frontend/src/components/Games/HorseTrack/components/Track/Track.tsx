import { useHorseTrackGameState } from "../../../../../hooks/useHorseTrackGameState";
import { HorseTrackGameState } from "../../../../../types/game.types";
import styles from "./Track.module.css";
import {
  HeartIcon,
  CrossIcon,
  SpadeIcon,
  DiamondIcon,
} from "../../../../../assets/icons/CardSuitIcons";
import React from "react";

const lanes: Array<keyof HorseTrackGameState["horses"]> = [
  "spade",
  "heart",
  "cross",
  "diamond",
];


const Track = () => {
  const { gameState, player } = useHorseTrackGameState();

  return (
    <div className={styles.container}>
      <div className={styles.lanes}>
        {lanes.map((suit) => {
          const { position, frozen } = gameState.horses[suit];
          return (
            <div key={suit} className={styles.trackContainer}>
              <span
                className={`${styles.suitName} ${
                  gameState.bets?.[player.id]?.suit === suit
                    ? styles.yourHorse
                    : ""
                }`}
              >
                {suit === "cross" && <CrossIcon />}
                {suit === "spade" && <SpadeIcon />}
                {suit === "heart" && <HeartIcon />}
                {suit === "diamond" && <DiamondIcon />}
              </span>

              <div className={styles.track}>
                <div
                  className={`${styles.horse} ${frozen ? styles.frozen : ""}`}
                  style={{
                    left: `calc(${
                      (position / (gameState.trackLength - 1)) * 90
                    }% )`,
                  }}
                >
                  🐎
                </div>

                {[...Array(gameState.trackLength)].map((_, i) => (
                  <div key={i} className={styles.zone}></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Track;
