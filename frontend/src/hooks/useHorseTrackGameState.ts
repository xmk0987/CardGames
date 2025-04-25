// hooks/useHorseTrackGameState.ts

import { useContext } from "react";
import { GameStateContext } from "../context/gameState/GameStateContext";
import { HorseTrackGameState } from "../types/game.types";

export const useHorseTrackGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error("GameStateContext not found");

  if (context.gameInfo.route !== "horseTrack") {
    throw new Error("Invalid game state type for Horse Track");
  }

  return {
    ...context,
    gameState: context.gameState as HorseTrackGameState,
  };
};
