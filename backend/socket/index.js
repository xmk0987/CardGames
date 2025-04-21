// socket/index.js
const { Server } = require("socket.io");
const registerLobbyHandlers = require("./lobbyHandlers");
const Game = require("../models/Game");

// Game socket handlers
const registerBusDriverHandlers = require("./games/BusDriver");

const gameHandlers = {
  busDriver: registerBusDriverHandlers,
};

function initializeSocket(server, options) {
  const io = new Server(server, options);

  // Shared state
  const lobbies = new Map(); // Map<gameId, Map<userId, user>>
  const socketToUser = new Map(); // Map<socketId, { lobbyId, userId }>

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    registerLobbyHandlers(io, socket, { lobbies, socketToUser });

    socket.on("playerAction", async (gameId, action, data, callback) => {
      const game = await Game.findById(gameId);
      if (!game) {
        console.log("Game not found");
        return;
      }

      const handler = gameHandlers[game.gameType];
      if (handler?.onPlayerAction) {
        await handler.onPlayerAction(io, game, action, data, callback);
      }
    });

    socket.on("leaveGame", async (gameId, player, callback) => {
      try {
        const game = await Game.findById(gameId);
        if (!game) {
          console.log("Game not found");
          return;
        }

        if (game.players.find((p) => p.id === player.id)) {
          game.players = game.players.filter((p) => p.id !== player.id);
          await game.save();
          if (game.players.length === 0) {
            await Game.findByIdAndDelete(gameId);
          }

          io.to(gameId).emit("playerLeft", { playerId: player.id });
        } else {
          throw new Error("Player not found");
        }

        if (callback) callback({ success: true });
      } catch (err) {
        console.error("Game action error:", err);
        if (callback) callback({ success: false, message: err.message });
      }
    });

    socket.on("startGame", async (gameId, gameType) => {
      try {
        const lobby = lobbies.get(gameId);
        if (!lobby) return;

        const players = [...lobby.values()].map(
          ({ id, username, isAdmin }) => ({
            id,
            username,
            isAdmin,
          })
        );

        const handler = gameHandlers[gameType];

        if (!handler?.onStart) return;

        const initialState = await handler.onStart(players);
        console.log("Initial state", initialState);

        await Game.create({
          _id: gameId,
          gameType,
          players,
          state: initialState,
          status: "started",
        });

        io.to(gameId).emit("gameStarted");
      } catch (error) {
        console.log("Game failed to start with error", error);
      }
    });
  });

  return io;
}

module.exports = initializeSocket;
