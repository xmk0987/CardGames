/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Pyramid from "./components/Pyramid/Pyramid";
import Hand from "./components/Hand/Hand";
import type { Card, GamePlayer } from "../../../types/game.types";
import Players from "./components/Players/Players";
import SendDrinks, {
  DrinkDistributionType,
} from "./components/SendDrinks/SendDrinks";
import SharedDrinks from "./components/SharedDrinks/SharedDrinks";
import { useSocket } from "../../../context/socket/useSocket";
import BonusPyramid from "./components/Pyramid/BonusPyramid";
import styles from "./BusDriver.module.css";
import NewGame from "../../NewGame/NewGame";
import FailModal from "./components/FailModal/FailModal";
import LeaveGame from "../../LeaveGame/LeaveGame";
import { useBusDriverGameState } from "../../../hooks/useBussDriverGameState";

const BusDriver = () => {
  const socket = useSocket();
  const { player, gameState, gameId } = useBusDriverGameState();
  const { readyPlayers } = gameState;

  const [playingCard, setPlayingCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isReady = (player: GamePlayer) => {
    return readyPlayers.some(
      (readyPlayer) => readyPlayer.username === player.username
    );
  };

  const handlePlayerReady = () => {
    if (loading) return;

    setLoading(true);
    socket.emit(
      "playerAction",
      gameId,
      "READY",
      { player },
      (_res: { success: boolean }) => {
        setLoading(false);
      }
    );
  };

  const handlePlayCard = (drinks: DrinkDistributionType) => {
    if (loading || isReady(player)) return;

    setLoading(true);
    const data = {
      drinkDistribution: drinks,
      card: playingCard,
      player,
    };

    socket.emit(
      "playerAction",
      gameId,
      "PLAY_CARD",
      data,
      (_res: { success: boolean }) => {
        setPlayingCard(null);
        setLoading(false);
      }
    );
  };

  const handleNextTurn = () => {
    if (loading) return;

    setLoading(true);
    socket.emit(
      "playerAction",
      gameId,
      "START_NEXT_TURN",
      {},
      (_res: { success: boolean }) => {
        setLoading(false);
      }
    );
  };

  const isBusDriver = player.id === gameState?.busDriver?.id;

  const handlePlayBonusCard = (card: Card) => {
    if (
      loading ||
      !isBusDriver ||
      gameState.failedBonus ||
      gameState.status !== "bonus"
    )
      return;

    setLoading(true);
    socket.emit(
      "playerAction",
      gameId,
      "PLAY_CARD",
      { card },
      (_res: { success: boolean }) => {
        setLoading(false);
      }
    );
  };

  const handleResetBonusRound = () => {
    if (
      loading ||
      !isBusDriver ||
      !gameState.failedBonus ||
      gameState.status !== "bonus"
    )
      return;

    setLoading(true);
    socket.emit(
      "playerAction",
      gameId,
      "RESET_BONUS",
      {},
      (_res: { success: boolean }) => {
        setLoading(false);
      }
    );
  };

  return (
    <div className={styles.container}>
      <LeaveGame />
      {gameState.status === "game" ? (
        <>
          <SharedDrinks handleNextTurn={handleNextTurn} />
          {playingCard && (
            <SendDrinks
              cancelPlayCard={() => setPlayingCard(null)}
              handlePlayCard={handlePlayCard}
            />
          )}
          <Players isReady={isReady} />
          <Pyramid />
          <Hand
            isReady={isReady(player)}
            handlePlayCard={setPlayingCard}
            handlePlayerReady={handlePlayerReady}
          />
        </>
      ) : (
        <>
          {gameState.status === "bonus" ? (
            <p className={styles.message}>{gameState.message}</p>
          ) : (
            <p className={styles.message}>GAME OVER</p>
          )}
          <BonusPyramid
            playBonusCard={handlePlayBonusCard}
            isBusDriver={isBusDriver}
          />
          {gameState.failedBonus && isBusDriver && (
            <FailModal
              isBusDriver={isBusDriver}
              resetBonusRound={handleResetBonusRound}
            />
          )}
          <div className={styles.totalCounter}>x{gameState.drinkAmount}</div>
          <NewGame />
        </>
      )}
    </div>
  );
};

export default BusDriver;
