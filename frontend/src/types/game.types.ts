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
  state: AllGameStates;
  createdAt: string;
  updatedAt: string;
}

export interface GamePlayer {
  username: string;
  id: string;
  isAdmin: boolean;
}

export interface BusDriverGameState {
  deckId: string;
  message: string;
  round: number;
  busDriver: GamePlayer | null;
  status: "bonus" | "game" | "finished";
  failedBonus: boolean;
  pyramid: Card[];
  drinkAmount: number;
  turnedCards: { [key: string]: Card[] };
  readyPlayers: GamePlayer[];
  playerCards: Record<string, Card[]>;
  drinkHistory: { giver: string; recipient: string; amount: number }[];
}

export interface FuckTheDealerGameState {
  deckId: string;
  message: string;
  status: "finished" | "game";
  dealerTurn: number;
  usedCards: { [key: string]: Card[] };
  dealer: GamePlayer;
  guesser: GamePlayer;
  cardsLeft: number;
  currentCard: Card;
  currentGuess: null | number;
  isSmallerOrBigger: "smaller" | "bigger" | "firstGuess";
}

export interface RingOfFireGameState {
  deckId: string;
  message: string;
  status: "finished" | "game";
  isChoosingMate: boolean;
  playerInTurn: GamePlayer;
  questionMaster: GamePlayer;
  mates: { [key: string]: GamePlayer[] };
  cardsLeft: number;
  currentCard: Card;
}

export type GameName = "busDriver" | "fuckTheDealer" | "ringOfFire";

export interface GameStateMap {
  busDriver: BusDriverGameState;
  ringOfFire: RingOfFireGameState;
  fuckTheDealer: FuckTheDealerGameState;
}

export type AllGameStates = GameStateMap[keyof GameStateMap];

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

export type GAME_ACTIONS =
  | "READY"
  | "PLAY_CARD"
  | "START_NEXT_TURN"
  | "RESET_BONUS"
  | "RESET_GAME"
  | "SET_MATE";
