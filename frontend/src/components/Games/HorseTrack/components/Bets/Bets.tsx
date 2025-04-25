// components/HorseTrack/BettingPanel.tsx
import React, { useEffect, useState } from "react";
import { useSocket } from "../../../../../context/socket/useSocket";
import { useHorseTrackGameState } from "../../../../../hooks/useHorseTrackGameState";
import PrimaryButton from "../../../../PrimaryButton/PrimaryButton";
import ModalLayout from "../../../../../layouts/ModalLayout/ModalLayout";
import styles from "./Bets.module.css";
import {
  CrossIcon,
  DiamondIcon,
  HeartIcon,
  SpadeIcon,
} from "../../../../../assets/icons/CardSuitIcons";

const suits = ["spade", "heart", "cross", "diamond"];

interface BetsProps {
  startGame: () => void;
}

const Bets: React.FC<BetsProps> = ({ startGame }) => {
  const { player, gameId, gameState, players } = useHorseTrackGameState();
  const socket = useSocket();

  const [selectedSuit, setSelectedSuit] = useState("");
  const [betAmount, setBetAmount] = useState(1);
  const [showBets, setShowBets] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  const alreadyBet = !!gameState.bets?.[player.id];

  const handleSubmit = () => {
    if (!betAmount || betAmount < 1) {
      setMessage("Bet amount has to be more than 0");
      return;
    }

    if (!selectedSuit) {
      setMessage("Choose a suit");
      return;
    }

    socket.emit("playerAction", gameId, "SET_BET", {
      suit: selectedSuit,
      bet: betAmount,
      player,
    });
  };

  useEffect(() => {
    if (gameState.status === "betsSet") {
      setShowBets(true);
    } else {
      if (!alreadyBet) {
        setShowBets(true);
      } else {
        setShowBets(false);
      }
    }
  }, [alreadyBet, gameState.status]);

  return (
    <>
      {showBets ? (
        alreadyBet ? (
          <ModalLayout onClose={() => setShowBets(false)}>
            <h2>{gameState.status === "betsSet" ? "Bets are in" : "Bets"}</h2>
            {gameState.message !== "" && <p>{gameState.message}</p>}
            <div className={styles.bets}>
              {Object.entries(gameState.bets || {}).map(([playerId, bet]) => (
                <div key={playerId} className={styles.bet}>
                  <p>
                    <strong>Player: </strong>
                    <span
                      className={`${playerId === player.id ? styles.you : ""}`}
                    >
                      {players.find((p) => p.id === playerId)?.username}
                      {playerId === player.id && " - You"}
                    </span>
                  </p>
                  <div className={styles.suitbet}>
                    <strong>Suit: </strong> {bet.suit.toUpperCase()}{" "}
                    {bet.suit === "cross" && <CrossIcon />}
                    {bet.suit === "spade" && <SpadeIcon />}
                    {bet.suit === "heart" && <HeartIcon />}
                    {bet.suit === "diamond" && <DiamondIcon />}
                  </div>
                  <p>
                    <strong>Bet:</strong> {bet.amount}
                  </p>
                </div>
              ))}
            </div>
            {player.isAdmin && gameState.status === "betsSet" && (
              <PrimaryButton text="START RACE" onClick={startGame} />
            )}
            <PrimaryButton text="Close" onClick={() => setShowBets(false)} />
          </ModalLayout>
        ) : (
          <ModalLayout onClose={() => setShowBets(false)}>
            <h2>Place Your Bet</h2>
            {message !== "" && <p>{message}</p>}
            <div className={styles.suits}>
              {suits.map((suit) => (
                <button
                  key={suit}
                  className={`${styles.suit} ${
                    selectedSuit === suit ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedSuit(suit)}
                >
                  {suit.toUpperCase()}
                  {suit === "cross" && <CrossIcon />}
                  {suit === "spade" && <SpadeIcon />}
                  {suit === "heart" && <HeartIcon />}
                  {suit === "diamond" && <DiamondIcon />}
                </button>
              ))}
            </div>
            <input
              type="number"
              className={styles.betAmount}
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value))}
              min={1}
            />
            <p>BUY IN: {Math.round(betAmount / 2)}</p>
            <PrimaryButton text="Submit Bet" onClick={handleSubmit} />
          </ModalLayout>
        )
      ) : (
        <>
          <button
            className={styles.showDrinks}
            onClick={() => setShowBets(true)}
          >
            BETS
          </button>
        </>
      )}
    </>
  );
};

export default Bets;
