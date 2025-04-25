// socket/games/FuckTheDealer.js
const HorseTrackLogic = require("../../gamesLogic/HorseTrackLogic");
const Game = require("../../models/Game");

function registerFuckTheDealerHandlers() {
  return {
    /**
     * Called when the game is started from the lobby.
     * Initializes game logic and returns the initial game state.
     */
    async onStart(_players) {
      try {
        const logic = new HorseTrackLogic();
        return await logic.startGame();
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Handles player actions during gameplay.
     */
    async onPlayerAction(io, game, action, data, callback) {
      const logic = new HorseTrackLogic(game);

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

module.exports = registerFuckTheDealerHandlers();
