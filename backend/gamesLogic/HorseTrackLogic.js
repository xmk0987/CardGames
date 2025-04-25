const LENGTH_OF_TRACK = 6;
const MOVE_MESSAGES = [
  "Horse gallops ahead!",
  "Off it goes like the wind!",
  "Speed demon on the loose!",
  "Pushing past the competition!",
  "Neigh way it’s slowing down!",
  "Charging forward with power!",
  "It's making a break for it!",
  "Another step closer to victory!",
  "The crowd goes wild!",
  "It surges forward!",
];

class HorseTrackLogic {
  constructor(gameDoc) {
    this.gameDoc = gameDoc || {};
    this.state = {
      ...this.defaultState(),
      ...(gameDoc?.state || {}),
      bets: gameDoc?.state?.bets ?? {},
    };
  }

  defaultState() {
    return {
      message: "",
      status: "bets",
      bets: null,
      horses: {
        spade: { position: 0, frozen: false },
        diamond: { position: 0, frozen: false },
        cross: { position: 0, frozen: false },
        heart: { position: 0, frozen: false },
      },
      winner: null,
      trackLength: LENGTH_OF_TRACK,
      checkpointReached: [],
    };
  }

  startGame() {
    return this.state;
  }

  handlePlayerAction(action, data) {
    switch (action) {
      case "MOVE_HORSE":
        this.moveHorse();
        break;
      case "SET_BET":
        this.setBet(data);
        break;
      case "RESET_GAME":
        this.resetGame();
        break;
      default:
        console.log(`Unknown action type: ${action}`);
    }

    return this.state;
  }

  resetGame() {
    this.state = this.defaultState();
    return this.state;
  }

  moveHorse() {
    if (this.state.status === "betsSet") {
      this.state.status = "game";
    }

    const horseKeys = Object.keys(this.state.horses);
    const randomIndex = Math.floor(Math.random() * horseKeys.length);
    const selectedHorse = horseKeys[randomIndex];
    const selected = this.state.horses[selectedHorse];

    selected.position += 1;

    // Check for race finish
    if (selected.position === LENGTH_OF_TRACK) {
      this.state.winner = selectedHorse;
      this.state.status = "finished";
      this.state.message = `${selectedHorse.toUpperCase()} won the race. Share your bets.`;
      return;
    }


    const randomMsg =
      MOVE_MESSAGES[Math.floor(Math.random() * MOVE_MESSAGES.length)];
    this.state.message = `${selectedHorse.toUpperCase()}: ${randomMsg}`;

    for (let i = 1; i < LENGTH_OF_TRACK; i++) {
      if (this.state.checkpointReached.includes(i)) continue;

      const allPassed = horseKeys.every(
        (key) => this.state.horses[key].position >= i
      );

      if (allPassed) {
        const toPullBack =
          horseKeys[Math.floor(Math.random() * horseKeys.length)];

        const currentPos = this.state.horses[toPullBack].position;
        this.state.horses[toPullBack].position = Math.max(0, currentPos - 1);

        this.state.message = `${toPullBack.toUpperCase()} stumbled and moved back!`;

        this.state.checkpointReached.push(i);
        break;
      }
    }
  }

  setBet(data) {
    const { bet, suit, player } = data;

    if (!this.state.bets) {
      this.state.bets = {};
    }

    if (this.state.bets[player.id]) {
      return;
    }

    this.state.bets[player.id] = { amount: bet, suit };

    if (Object.keys(this.state.bets).length === this.gameDoc.players.length) {
      this.state.status = "betsSet";
    }
  }
}

module.exports = HorseTrackLogic;
