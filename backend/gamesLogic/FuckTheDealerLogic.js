const { getNewDeck, drawACard, discardCard } = require("../deckApi");
const { mapCardValueToNumber } = require("../utils/helpers");

class FuckTheDealerLogic {
  constructor(gameDoc) {
    this.gameDoc = gameDoc || {};
    this.state = {
      ...this.defaultState(),
      ...(gameDoc?.state || {}),
      usedCards: gameDoc?.state?.usedCards ?? {},
    };
  }

  defaultState() {
    return {
      deckId: "",
      message: "",
      status: "game",
      dealerTurn: 1,
      usedCards: null,
      dealer: null,
      guesser: null,
      cardsLeft: 52,
      currentCard: null,
      currentGuess: null,
      isSmallerOrBigger: "firstGuess",
    };
  }

  async startGame(players) {
    this.gameDoc.players = players;
    await this.initializeDecks();
    this.determineDealerGuesser();
    return this.state;
  }

  async initializeDecks() {
    const deck = await getNewDeck();
    if (!deck.success) throw new Error("Failed to get a new deck");

    this.state.deckId = deck.deck_id;
    await this.handleDrawACard();
  }

  async handleDrawACard() {
    if (this.state.cardsLeft > 1) {
      const card = await drawACard(this.state.deckId);
      if (!card.success) throw new Error("Card could not be drawn.");

      this.state.currentCard = card.cards[0];
      this.state.cardsLeft = card.remaining + 1;
    } else {
      this.state.cardsLeft = 0;
      console.log("Game finished");
      this.state.status = "finished";
    }
  }

  determineDealerGuesser() {
    const players = this.gameDoc.players;
    const dealerIndex = Math.floor(Math.random() * players.length);
    this.state.dealer = players[dealerIndex];
    this.state.guesser = players[(dealerIndex + 1) % players.length];
  }

  async handlePlayerAction(action, data) {
    const players = this.gameDoc.players;
    if (players.length === 1) {
      throw new Error("Cant play the game with only one player");
    }

    switch (action) {
      case "PLAY_CARD":
        await this.handlePlayCard(data);
        break;
      case "RESET_GAME":
        await this.resetGame();
        break;
    }

    return this.state;
  }

  async resetGame() {
    this.state = this.defaultState();
    await this.initializeDecks();
    this.determineDealerGuesser();
    return this.state;
  }

  async handlePlayCard(data) {
    const { cardValue } = data;

    const currentCard = this.state.currentCard;
    const actualValue = mapCardValueToNumber(currentCard.value);

    if (cardValue === actualValue) {
      return await this.handleCorrectGuess(cardValue);
    }

    if (this.state.currentGuess !== null) {
      return await this.handleWrongGuess(cardValue, actualValue);
    }

    let message = "";
    this.state.currentGuess = cardValue;
    if (cardValue < actualValue) {
      message = `${cardValue} was guessed. Actual card is bigger.`;
      this.state.isSmallerOrBigger = "bigger";
    } else {
      message = `${cardValue} was guessed. Actual card is smaller.`;
      this.state.isSmallerOrBigger = "smaller";
    }

    this.state.currentGuess = cardValue;
    this.state.message = message;
  }

  async handleCorrectGuess(guessedValue) {
    this.state.dealerTurn = 1;
    let drinkAmount =
      this.state.isSmallerOrBigger === "firstGuess"
        ? guessedValue
        : Math.round(guessedValue / 2);

    console.log("is smaller or bigger", this.state.isSmallerOrBigger);
    console.log("drink amount", drinkAmount);
    this.state.isSmallerOrBigger = "firstGuess";
    this.state.message = `${this.state.guesser.username} guessed ${guessedValue} correctly. ${this.state.dealer.username} drink ${drinkAmount}!`;

    this.changeGuesser();
    await this.handleNextTurnCard();
  }

  async handleWrongGuess(guessedValue, actualValue) {
    this.state.dealerTurn++;

    this.state.message = `${
      this.state.guesser.username
    } guessed ${guessedValue}. Actual value was ${actualValue}. ${
      this.state.guesser.username
    } drink ${Math.abs(actualValue - guessedValue)}!`;

    if (this.state.dealerTurn > 3) {
      this.changeDealer();
    }

    this.changeGuesser();
    await this.handleNextTurnCard();
  }

  changeGuesser() {
    const players = this.gameDoc.players;
    const dealerIndex = players.findIndex((p) => p.id === this.state.dealer.id);
    let guesserIndex = players.findIndex((p) => p.id === this.state.guesser.id);

    let nextGuesserIndex = (guesserIndex + 1) % players.length;

    while (nextGuesserIndex === dealerIndex && players.length > 1) {
      nextGuesserIndex = (nextGuesserIndex + 1) % players.length;

      if (nextGuesserIndex === guesserIndex) break;
    }

    this.state.guesser = players[nextGuesserIndex];
  }

  changeDealer() {
    const players = this.gameDoc.players;
    const dealerIndex = players.findIndex((p) => p.id === this.state.dealer.id);
    const nextDealerIndex = (dealerIndex + 1) % players.length;
    this.state.dealerTurn = 1;
    this.state.dealer = players[nextDealerIndex];
    if (this.state.dealer.id === this.state.guesser.id) {
      this.changeGuesser();
    }
  }

  async handleNextTurnCard() {
    const deckId = this.state.deckId;
    const currentCard = this.state.currentCard;

    if (!this.state.usedCards[currentCard.value]) {
      this.state.usedCards[currentCard.value] = [];
    }

    this.state.currentGuess = null;
    this.state.usedCards[currentCard.value].push(currentCard);

    const discardedCard = await discardCard(deckId, currentCard.code);

    if (!discardedCard) throw new Error("Failed to discard card");

    await this.handleDrawACard();
  }
}

module.exports = FuckTheDealerLogic;

/* export interface FuckTheDealerGameState {
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
} */
