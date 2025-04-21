export interface LobbyPlayer {
  username: string;
  id: string;
  gameId: string;
  socketId?: string;
  isAdmin: boolean;
}

export interface IconProps {
  size: number;
}

export interface GameState {
  _id: string;
  gameType: string;
  players: GamePlayer[];
  state: BussDriverGameState;
  createdAt: string;
  updatedAt: string;
}

export interface GamePlayer {
  username: string;
  id: string;
  isAdmin: boolean;
}

export interface BussDriverGameState {
  deckId: string;
  message: string;
  round: number;
  bussDriver: GamePlayer | null;
  status: "bonus" | "game" | "finished";
  failedBonus: boolean;
  pyramid: Card[];
  drinkAmount: number;
  turnedCards: { [key: string]: Card[] };
  readyPlayers: GamePlayer[];
  playerCards: Record<string, Card[]>;
  drinkHistory: { giver: string; recipient: string; amount: number }[];
}

// ! FIX TYPES
export interface Card {
  code: string;
  image: string;
  value: string;
  suit: string;
}

export interface Deck {
  deck_id: string;
  cards: Card[];
}

export interface Game {
  name: string;
  image: string;
  desc: string;
  minPlayers: number;
  maxPlayers: number;
  route: string;
  rules: string[];
}

export type BUSDRIVER_GAME_ACTIONS =
  | "READY"
  | "PLAY_CARD"
  | "START_NEXT_TURN"
  | "RESET_BONUS"
  | "RESET_GAME";
