import React, { useState } from "react";
import ModalLayout from "../../../../../layouts/ModalLayout/ModalLayout";
import { useRingOfFireGameState } from "../../../../../hooks/useRingOfFireGameState";
import styles from "./Mate.module.css";
import { GamePlayer } from "../../../../../types/game.types";

const Mates = () => {
  const { gameState, players, isYou } = useRingOfFireGameState();
  const [showModal, setShowModal] = useState(false);

  const getMates = (playerId: string): GamePlayer[] => {
    return gameState.mates[playerId] || [];
  };

  return (
    <>
      <button className={styles.mateBtn} onClick={() => setShowModal(true)}>
        View Mates
      </button>

      {showModal && (
        <ModalLayout onClose={() => setShowModal(false)}>
          <h2>Current Mates</h2>
          <div className={styles.mateList}>
            {players.map((p) => {
              const mates = getMates(p.id);
              return (
                <div key={p.id} className={styles.mateEntry}>
                  <strong className={`${isYou(p) ? styles.you : ""}`}>
                    {p.username}
                    {isYou(p) ? " - You" : ""}
                  </strong>
                  {mates.length === 0 ? (
                    <span className={styles.noMates}> has no mates</span>
                  ) : (
                    <ul className={styles.mateNames}>
                      {mates.map((m) => (
                        <li
                          key={m.id}
                          className={`${isYou(m) ? styles.you : ""}`}
                        >
                          {m.username}
                          {isYou(m) ? " - You" : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </ModalLayout>
      )}
    </>
  );
};

export default Mates;
