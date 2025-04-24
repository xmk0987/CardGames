// games/BusDriverLogic.js

const { getNewDeck, drawACard, returnAllCardsToDeck } = require("../deckApi");

const PYRAMID_CARDS_AMOUNT = 15;

class BusDriverLogic {
  constructor(gameDoc) {
    this.gameDoc = gameDoc || {};
    this.state = gameDoc?.state || this.defaultState();
  }

  defaultState() {
    return {
      deckId: "",
      round: 0,
      busDriver: null,
      pyramid: [],
      drinkAmount: 2,
      turnedCards: {},
      readyPlayers: [],
      playerCards: {},
      drinkHistory: [],
      message: "",
      failedBonus: false,
      status: "game",
    };
  }

  async startGame(players) {
    this.gameDoc.players = players;
    await this.initializeDecks();
    return this.state;
  }

  async initializeDecks() {
    const deck = await getNewDeck();
    if (!deck.success) throw new Error("Failed to get a new deck");

    this.state.deckId = deck.deck_id;
    await this.initializePyramid();
    await this.initializePlayerHands();
  }

  // Draw all the cards for the pyramid from the deck.
  // Create own pile for the pyramid to the deck api
  // Set the pyramid to contain the cards
  async initializePyramid(bonus = false) {
    const deckId = this.state.deckId;
    const pyramidCards = await drawACard(deckId, PYRAMID_CARDS_AMOUNT);
    if (!pyramidCards.success) throw new Error("Failed to initialize pyramid");
    this.state.pyramid = pyramidCards.cards;
    if (!bonus) {
      this.state.turnedCards[this.state.pyramid[0].code] = [];
    }
  }

  async initializePlayerHands() {
    const deckId = this.state.deckId;
    const players = this.gameDoc.players;
    const cardsLeft = 52 - PYRAMID_CARDS_AMOUNT;
    const cardsPerPlayer = Math.floor(cardsLeft / players.length);
    const allPlayerCards = await drawACard(deckId, cardsLeft);

    if (!allPlayerCards.success)
      throw new Error("Failed to draw cards for players");

    for (let player of players) {
      const playerCards = allPlayerCards.cards.splice(0, cardsPerPlayer);
      this.state.playerCards[player.username] = playerCards;
    }
  }

  async handlePlayerAction(action, data) {
    switch (action) {
      case "READY":
        this.handleReadyAction(data.player);
        break;
      case "PLAY_CARD":
        await this.handlePlayCard(data);
        break;
      case "START_NEXT_TURN":
        await this.handleStartNextTurn();
        break;
      case "RESET_BONUS":
        await this.handleStartBonusRound(true);
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
    return this.state;
  }

  handleReadyAction(player) {
    const readyPlayers = this.state.readyPlayers;
    const playerIndex = readyPlayers.findIndex(
      (readyPlayer) => readyPlayer.username === player.username
    );

    if (playerIndex === -1) {
      readyPlayers.push(player);
    } else {
      readyPlayers.splice(playerIndex, 1);
    }

    this.state.readyPlayers = readyPlayers;
  }

  getCurrentPyramidCard() {
    return this.state.pyramid[this.state.round];
  }

  async handlePlayCard(data) {
    if (this.state.busDriver) {
      await this.playBonusCard(data);
    } else {
      const { drinkDistribution, card, player } = data;

      // Set the card to turned cards
      const currentPyramidCard = this.getCurrentPyramidCard();
      this.state.turnedCards[currentPyramidCard.code].push(card);

      // Distribute drinks to players
      this.distributeDrinks(drinkDistribution, player);

      // Remove card from player hand
      const playerCards = this.state.playerCards[player.username] || [];
      this.state.playerCards[player.username] = playerCards.filter(
        (c) => c.code !== card.code
      );
    }
  }

  distributeDrinks(drinkDistribution, player) {
    for (const [recipient, amount] of Object.entries(drinkDistribution)) {
      const existingEntry = this.state.drinkHistory.find(
        (entry) =>
          entry.giver === player.username && entry.recipient === recipient
      );

      if (existingEntry) {
        existingEntry.amount += amount;
      } else {
        // If entry doesn't exist, create a new one
        this.state.drinkHistory.push({
          giver: player.username,
          recipient: recipient,
          amount: amount,
        });
      }
    }
  }

  async handleStartNextTurn() {
    if (this.state.round === PYRAMID_CARDS_AMOUNT - 1) {
      console.log("Game finished");
      await this.handleStartBonusRound();
      return;
    }

    this.state.round++;
    const levelChangeRounds = this.getLevelChangeRounds();

    if (levelChangeRounds.includes(this.state.round)) {
      this.state.drinkAmount += 2;
    }

    const pyramidCard = this.getCurrentPyramidCard();
    this.state.turnedCards[pyramidCard.code] = [];
    this.state.drinkHistory = [];
    this.state.readyPlayers = [];
  }

  getLevelChangeRounds() {
    const changeRounds = [];

    let n = 1;
    while ((n * (n + 1)) / 2 <= PYRAMID_CARDS_AMOUNT) {
      n++;
    }
    const baseLevelSize = n - 1;

    let round = 0;
    let cardsLeft = PYRAMID_CARDS_AMOUNT;
    let cardsInLevel = baseLevelSize;

    while (cardsLeft > 0 && cardsInLevel > 0) {
      round += cardsInLevel;
      cardsLeft -= cardsInLevel;
      cardsInLevel--;
      if (cardsLeft > 0) {
        changeRounds.push(round);
      }
    }

    return changeRounds;
  }

  async handleStartBonusRound(reset = false) {
    console.log("Bonus round");

    this.state.status = "bonus";
    // Find loser
    if (!reset) {
      const loser = this.determineLoser();
      this.state.busDriver = loser;
      this.state.drinkAmount = 0;
      this.state.message = `${this.state.busDriver.username} is the BUS DRIVER`;
    }

    // Reset deck
    const bonusDeck = await returnAllCardsToDeck(this.state.deckId);
    if (!bonusDeck.success) {
      throw new Error("Bonus game could not be setup");
    }

    // Setup new pyramid
    await this.initializePyramid(true);

    this.state.playerCards = {};
    this.state.turnedCards = {};
    this.state.drinkHistory = [];
    this.state.readyPlayers = [];
    this.state.round = 1;
    this.state.failedBonus = false;
  }

  async playBonusCard(data) {
    const { card } = data;
    const failCardValues = ["ACE", "KING", "QUEEN", "JACK"];

    console.log("Failed bonus", failCardValues.includes(card.value));
    if (failCardValues.includes(card.value)) {
      this.state.message = `${this.state.busDriver.username} has to drink ${this.state.round}`;
      this.state.drinkAmount += this.state.round;
      this.state.failedBonus = true;
    } else {
      this.state.round++;
      if (this.state.round >= 6) {
        this.state.message = "Go again?";
        this.state.status = "finished";
      }
    }
    this.state.turnedCards[card.code] = [];
  }

  determineLoser() {
    // Find loser
    const playerCards = this.state.playerCards;
    const players = this.gameDoc.players;
    let maxCards = 0;
    const playersByCardCount = {};

    for (const player of players) {
      const cardCount = playerCards[player]?.length ?? 0;

      if (!playersByCardCount[cardCount]) {
        playersByCardCount[cardCount] = [];
      }

      playersByCardCount[cardCount].push(player);
      maxCards = Math.max(maxCards, cardCount);
    }

    const potentialLosers = playersByCardCount[maxCards];

    // Randomly select a loser among players with most cards
    const randomIndex = Math.floor(Math.random() * potentialLosers.length);
    const loser = potentialLosers[randomIndex];

    console.log(`Loser is: ${loser}`);
    return loser;
  }
}

module.exports = BusDriverLogic;
