// socket/lobbyHandlers.js
const Game = require("../models/Game");

const RECONNECT_GRACE_PERIOD = 5000;

function registerLobbyHandlers(io, socket, { lobbies, socketToUser }) {
  socket.on("joinLobby", (lobbyId, userData) => {
    console.log("Trying to join lobby", lobbyId, userData);
    if (!lobbyId || !userData?.id || !userData?.username) return;

    if (!lobbies.has(lobbyId)) {
      lobbies.set(lobbyId, new Map());
    }

    const lobby = lobbies.get(lobbyId);
    const existingUsernames = [...lobby.values()].map((u) => u.username);

    const usernameTaken = existingUsernames.some(
      (username) =>
        username === userData.username &&
        [...lobby.entries()].find(
          ([uid, u]) => u.username === username
        )?.[0] !== userData.id
    );

    if (usernameTaken) {
      socket.emit("usernameTaken", {
        message: `Username '${userData.username}' is already taken in this lobby.`,
      });
      return;
    }

    const isFirstUser = lobby.size === 0;
    const isAnotherAdmin = [...lobby.values()]
      .filter((user) => user.id !== userData.id)
      .some((user) => user.isAdmin);

    const newUser = {
      ...userData,
      socketId: socket.id,
      isAdmin: isFirstUser ? true : !isAnotherAdmin,
    };

    lobby.set(userData.id, newUser);
    socketToUser.set(socket.id, { lobbyId, userId: userData.id });

    socket.join(lobbyId);

    socket.emit("lobbyJoined", {
      users: [...lobby.values()],
      userData: newUser,
    });

    socket.broadcast.to(lobbyId).emit("usersUpdated", {
      users: [...lobby.values()],
    });
  });

  socket.on("reconnectLobby", async (gameId, userData) => {
    if (!gameId || !userData?.id || !userData?.username) return;

    const game = await Game.findById(gameId);
    if (!game) {
      socket.emit("reconnectFailed", { message: "Game not found" });
      return;
    }

    const currentPlayers = game.players;

    const foundPlayer = currentPlayers.find((p) => p.id === userData.id);
    if (!foundPlayer) {
      socket.emit("reconnectFailed", {
        message: "Player not part of the game",
      });
      return;
    }

    if (!lobbies.has(gameId)) {
      lobbies.set(gameId, new Map());
    }

    const lobby = lobbies.get(gameId);

    const { id, username, isAdmin } = foundPlayer;

    const reconnectedPlayer = {
      id,
      username,
      isAdmin,
      gameId,
      socketId: userData.socketId,
    };

    lobby.set(userData.id, reconnectedPlayer);
    socketToUser.set(socket.id, { lobbyId: gameId, userId: userData.id });

    socket.join(gameId);

    socket.emit("reconnectSuccess", {
      player: reconnectedPlayer,
    });
  });

  socket.on("leaveLobby", (lobbyId, userData) => {
    const lobby = lobbies.get(lobbyId);
    if (!lobby || !lobby.has(userData.id)) return;

    const wasAdmin = lobby.get(userData.id)?.isAdmin;
    lobby.delete(userData.id);
    socket.leave(lobbyId);
    socketToUser.delete(socket.id);

    if (wasAdmin && lobby.size > 0) {
      const [firstUser] = lobby.values();
      firstUser.isAdmin = true;
      io.to(firstUser.socketId).emit("adminPromoted", { user: firstUser });
    }

    if (lobby.size === 0) {
      lobbies.delete(lobbyId);
    }

    io.to(lobbyId).emit("usersUpdated", {
      users: [...lobby.values()],
    });
  });

  socket.on("disconnect", () => {
    const userInfo = socketToUser.get(socket.id);
    if (!userInfo) return;

    const { lobbyId, userId } = userInfo;
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    const wasAdmin = lobby.get(userId)?.isAdmin;
    const user = lobby.get(userId);

    socketToUser.delete(socket.id);

    if (!user) return;

    user.disconnectedAt = Date.now();

    io.to(lobbyId).emit("usersUpdated", {
      users: [...lobby.values()],
    });

    setTimeout(() => {
      const currentUser = lobby.get(userId);
      if (!currentUser?.disconnectedAt) return;

      const stillDisconnected =
        Date.now() - currentUser.disconnectedAt >= RECONNECT_GRACE_PERIOD;

      if (!stillDisconnected) return;

      lobby.delete(userId);

      if (wasAdmin && lobby.size > 0) {
        const [firstUser] = lobby.values();
        firstUser.isAdmin = true;
        io.to(firstUser.socketId).emit("adminPromoted", { user: firstUser });
      }

      if (lobby.size === 0) {
        lobbies.delete(lobbyId);
      } else {
        io.to(lobbyId).emit("usersUpdated", {
          users: [...lobby.values()],
        });
      }
    }, RECONNECT_GRACE_PERIOD);
  });
}

module.exports = registerLobbyHandlers;
