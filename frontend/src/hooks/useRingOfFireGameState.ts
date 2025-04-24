// hooks/useRingOfFireGameState.ts

import { useContext } from "react";
import { GameStateContext } from "../context/gameState/GameStateContext";
import { RingOfFireGameState } from "../types/game.types";

export const useRingOfFireGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error("GameStateContext not found");

  if (context.gameInfo.route !== "ringOfFire") {
    throw new Error("Invalid game state type for Ring Of Fire");
  }

  return {
    ...context,
    gameState: context.gameState as RingOfFireGameState,
  };
};
