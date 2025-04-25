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

export interface HorseTrackGameState {
  message: string;
  status: "finished" | "game" | "bets" | "betsSet";
  bets: {
    [key: string]: {
      suit: CardSuits;
      amount: number;
    };
  };
  horses: {
    spade: { position: number; frozen: boolean };
    heart: { position: number; frozen: boolean };
    cross: { position: number; frozen: boolean };
    diamond: { position: number; frozen: boolean };
  };
  winner: CardSuits;
  trackLength: number;
}

type CardSuits = "heart" | "cross" | "spade" | "diamond";
export interface GameStateMap {
  busDriver: BusDriverGameState;
  ringOfFire: RingOfFireGameState;
  fuckTheDealer: FuckTheDealerGameState;
  horseTrack: HorseTrackGameState;
}

export type AllGameStates = GameStateMap[keyof GameStateMap];

export interface Card {
  code: string;
  image: string;
  value: string;
  suit: string;
}
export interface GameInfo {
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
  | "SET_MATE"
  | "SET_BET"
  | "MOVE_HORSE";
