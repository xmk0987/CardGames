import { createContext } from "react";
import {
  Game,
  GameState,
  BusDriverGameState,
  GamePlayer,
} from "../../types/game.types";

interface GameStateContextProps {
  onGoingGame: Omit<GameState, "state" | "players"> & {
    state: BusDriverGameState;
  };
  gameInfo: Game;
  player: GamePlayer;
  gameState: BusDriverGameState;
  players: GamePlayer[];
  gameId: string;
}

export const GameStateContext = createContext<
  GameStateContextProps | undefined
>(undefined);
