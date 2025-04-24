const { getNewDeck, drawACard, discardCard } = require("../deckApi");

const RING_CARD_AMOUNT = 52;

class RingOfFireLogic {
  constructor(gameDoc) {
    this.gameDoc = gameDoc || {};
    this.state = {
      ...this.defaultState(),
      ...(gameDoc?.state || {}),
      mates: gameDoc?.state?.mates ?? {},
    };
  }

  defaultState() {
    return {
      deckId: "",
      message: "",
      status: "game",
      playerInTurn: null,
      questionMaster: null,
      mates: null,
      cardsLeft: RING_CARD_AMOUNT,
      currentCard: null,
      isChoosingMate: false,
    };
  }

  async startGame(players) {
    this.gameDoc.players = players;
    await this.initializeDecks();
    this.changePlayerInTurn();
    return this.state;
  }

  async initializeDecks() {
    // Set up deck
    const deck = await getNewDeck();
    if (!deck.success) throw new Error("Failed to get a new deck");

    this.state.deckId = deck.deck_id;
    this.state.cardsLeft = deck.remaining;
  }

  /**
   * Advances the game to the next player's turn.
   * If no player is currently in turn, selects a random one to start.
   */
  changePlayerInTurn() {
    const players = this.gameDoc.players;

    // Handle case where there are no players
    if (!players || players.length === 0) return;

    // If no current player, choose one at random
    if (!this.state.playerInTurn) {
      const randomIndex = Math.floor(Math.random() * players.length);
      this.state.playerInTurn = players[randomIndex];
      return;
    }

    // Find current player index by ID
    const currentIndex = players.findIndex(
      (p) => p.id === this.state.playerInTurn.id
    );

    // Fallback if current player is no longer in list
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % players.length;

    this.state.playerInTurn = players[nextIndex];
  }

  async handlePlayerAction(action, data) {
    switch (action) {
      case "PLAY_CARD":
        await this.handlePlayCard();
        break;
      case "RESET_GAME":
        await this.resetGame();
        break;
      case "SET_MATE":
        await this.handleSetMate(data.player);
        break;
    }

    return this.state;
  }

  async resetGame() {
    this.state = this.defaultState();
    await this.initializeDecks();
    this.changePlayerInTurn();
    return this.state;
  }

  async handlePlayCard() {
    this.state.message = "";
    const newCard = await drawACard(this.state.deckId);
    if (!newCard.success) throw new Error("Failed to draw a card");

    this.state.currentCard = newCard.cards[0];
    this.state.cardsLeft = newCard.remaining;

    if (this.state.currentCard.value === "JACK") {
      this.state.message = `${this.state.playerInTurn.username} is the new Question Master!`;
      this.state.questionMaster = this.state.playerInTurn;
    }

    if (this.state.currentCard.value !== "8") {
      this.changePlayerInTurn();
    } else {
      this.state.isChoosingMate = true;
      this.state.message = `${this.state.playerInTurn.username} is choosing a mate!`;
    }

    if (newCard.remaining === 0) {
      this.state.status = "finished";
      this.state.message = "GAME OVER";
    }
  }

  async handleSetMate(player) {
    const currentPlayer = this.state.playerInTurn;
    let message = "";

    if (!currentPlayer) return;

    if (player) {
      const key = currentPlayer.id;

      if (!this.state.mates[key]) {
        this.state.mates[key] = [];
      }

      const alreadyAdded = this.state.mates[key].some(
        (p) => p.id === player.id
      );

      if (!alreadyAdded) {
        this.state.mates[key].push(player);
        message = `${currentPlayer.username} chose ${player.username} as his mate.`;
      }
    }

    this.state.isChoosingMate = false;
    this.state.message =
      message === ""
        ? `${currentPlayer.username} skipped choosing a mate.`
        : message;

    this.changePlayerInTurn();
  }
}

module.exports = RingOfFireLogic;
