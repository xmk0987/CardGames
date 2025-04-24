// hooks/useFuckTheDealerGameState.ts
import { useContext } from "react";
import { GameStateContext } from "../context/gameState/GameStateContext";
import { FuckTheDealerGameState } from "../types/game.types";

export const useFuckTheDealerGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error("GameStateContext not found");

  if (context.gameInfo.route !== "fuckTheDealer") {
    throw new Error("Invalid game state type for fuck the dealer");
  }

  return {
    ...context,
    gameState: context.gameState as FuckTheDealerGameState,
  };
};
