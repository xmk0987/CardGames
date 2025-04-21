import { createContext } from "react";
import {
  Game,
  GameState,
  BussDriverGameState,
  GamePlayer,
} from "../../types/game.types";

interface GameStateContextProps {
  onGoingGame: Omit<GameState, "state" | "players"> & {
    state: BussDriverGameState;
  };
  gameInfo: Game;
  player: GamePlayer;
  gameState: BussDriverGameState;
  players: GamePlayer[];
  gameId: string;
}

export const GameStateContext = createContext<
  GameStateContextProps | undefined
>(undefined);
