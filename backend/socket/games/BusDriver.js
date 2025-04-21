// socket/games/BusDriver.js
const BusDriverLogic = require("../../gamesLogic/BusDriverLogic");
const Game = require("../../models/Game");

function registerBusDriverHandlers() {
  return {
    /**
     * Called when the game is started from the lobby.
     * Initializes game logic and returns the initial game state.
     */
    async onStart(players) {
      try {
        const logic = new BusDriverLogic();
        return logic.startGame(players);
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Handles player actions during gameplay.
     */
    async onPlayerAction(io, game, action, data, callback) {
      const logic = new BusDriverLogic(game);

      try {
        const updatedState = await logic.handlePlayerAction(action, data);

        await Game.updateOne({ _id: game._id }, { state: updatedState });

        io.to(game._id).emit("stateUpdated", updatedState);

        if (callback) callback({ success: true }); // ✅ Ack back to client
      } catch (err) {
        console.error("Game action error:", err);
        if (callback) callback({ success: false, message: err.message }); // ❌ Failed ack
      }
    },
  };
}

module.exports = registerBusDriverHandlers();
