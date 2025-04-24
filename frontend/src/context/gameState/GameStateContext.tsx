// GameStateContext.ts
import { createContext } from "react";
import {
  Game,
  GamePlayer,
  AllGameStates,
  GameState,
  LobbyPlayer,
} from "../../types/game.types";

export interface GameStateContextProps<
  T extends AllGameStates = AllGameStates
> {
  onGoingGame: GameState;
  gameInfo: Game;
  player: LobbyPlayer;
  gameState: T;
  players: GamePlayer[];
  gameId: string;
  leaveGame: () => void;
  resetGame: () => void;
  isYou: (p: GamePlayer) => boolean;
}

export const GameStateContext = createContext<
  GameStateContextProps | undefined
>(undefined);
