// hooks/useBusDriverGameState.ts

import { useContext } from "react";
import { GameStateContext } from "../context/gameState/GameStateContext";
import { BusDriverGameState } from "../types/game.types";

export const useBusDriverGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error("GameStateContext not found");

  if (context.gameInfo.route !== "busDriver") {
    throw new Error("Invalid game state type for Bus Driver");
  }

  return {
    ...context,
    gameState: context.gameState as BusDriverGameState,
  };
};
