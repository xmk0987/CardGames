/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GameStateContext } from "./GameStateContext";
import { useNavigate, useParams } from "react-router-dom";
import { games } from "../../lib/games";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  AllGameStates,
  GamePlayer,
  GameState,
  LobbyPlayer,
} from "../../types/game.types";
import { useSocket } from "../../context/socket/useSocket";
import { SERVER_URL } from "../../lib/server";

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket = useSocket();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { gameName, gameId } = useParams();
  const [player, setPlayer] = useState<LobbyPlayer | null>(null);
  const hasReconnected = useRef(false); // Prevent infinite reconnect attempts
  const [loading, setLoading] = useState<boolean>(false);

  const gameInfo = gameName ? games[gameName as keyof typeof games] : null;

  const fetchGameState = async () => {
    if (!gameId) throw new Error("No game ID provided.");

    const response = await axios.get(`${SERVER_URL}/game/${gameId}`);
    return response.data;
  };

  const {
    data: onGoingGame,
    isLoading,
    isError,
  } = useQuery<GameState>({
    queryKey: ["gameState", gameId],
    queryFn: fetchGameState,
    enabled: !!gameId,
  });

  const sortedPlayers = useMemo(() => {
    if (!onGoingGame?.players || !player) return [];
    return [...onGoingGame.players].sort((a, b) => {
      if (a.id === player?.id) return -1;
      if (b.id === player?.id) return 1;
      return a.username.localeCompare(b.username);
    });
  }, [onGoingGame?.players, player]);

  // Load player from localStorage
  useEffect(() => {
    const savedPlayer = localStorage.getItem("user");
    if (!savedPlayer) {
      navigate(`/lobby/${gameName}`);
      return;
    }

    const parsedPlayer = JSON.parse(savedPlayer);
    setPlayer((prev) => {
      if (!prev && parsedPlayer) {
        return {
          ...parsedPlayer,
          socketId: socket?.id ?? parsedPlayer.socketId,
        };
      }
      return prev;
    });
  }, [socket?.id, gameName, navigate]);

  // Handle reconnect only once
  useEffect(() => {
    if (!socket || !player || !gameId || hasReconnected.current) return;

    hasReconnected.current = true;

    socket.emit("reconnectLobby", gameId, player);

    const handleSuccess = (data: { player: LobbyPlayer }) => {
      setPlayer(data.player);
      localStorage.setItem("user", JSON.stringify(data.player));
    };

    const handleFailure = () => {
      localStorage.removeItem("user");
      navigate(`/lobby/${gameName}`);
    };

    socket.on("reconnectSuccess", handleSuccess);
    socket.on("reconnectFailed", handleFailure);

    return () => {
      socket.off("reconnectSuccess", handleSuccess);
      socket.off("reconnectFailed", handleFailure);
    };
  }, [socket, gameId, player, navigate, gameName, queryClient]);

  // Sync state updates
  useEffect(() => {
    if (!socket || !gameId) return;

    const handleStateUpdated = (newState: AllGameStates) => {
      queryClient.setQueryData(["gameState", gameId], (oldData: GameState) => {
        if (!oldData) return;
        return { ...oldData, state: newState };
      });
    };

    const handlePlayerLeft = (data: { playerId: string }) => {
      queryClient.setQueryData(
        ["gameState", gameId],
        (oldData: GameState | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            players: oldData.players.filter((p) => p.id !== data.playerId),
          };
        }
      );
    };

    socket.on("stateUpdated", handleStateUpdated);
    socket.on("playerLeft", handlePlayerLeft);

    return () => {
      socket.off("stateUpdated", handleStateUpdated);
      socket.off("playerLeft", handlePlayerLeft);
    };
  }, [socket, gameId, queryClient]);

  const leaveGame = () => {
    if (loading || !gameId || !player) return;

    socket.emit("leaveGame", gameId, player, (_res: { success: boolean }) => {
      setLoading(false);
      navigate("/games");
    });
  };

  const resetGame = () => {
    if (
      loading ||
      !player?.isAdmin ||
      !gameId ||
      onGoingGame?.state?.status !== "finished"
    )
      return;

    setLoading(true);
    socket.emit(
      "playerAction",
      gameId,
      "RESET_GAME",
      {},
      (_res: { success: boolean }) => {
        setLoading(false);
      }
    );
  };

  const isYou = (p: GamePlayer) => {
    return player?.id === p.id;
  };

  if (isLoading) return <div>Loading game...</div>;
  if (isError) return <div>Error loading game state</div>;
  if (!gameName || !gameInfo || !onGoingGame || !gameId)
    return <div>Game not found</div>;
  if (!player) return <div>Player not found</div>;
  if (!onGoingGame.state) return <div>Game state not loaded</div>;

  return (
    <GameStateContext.Provider
      value={{
        onGoingGame,
        gameInfo,
        player,
        leaveGame,
        resetGame,
        isYou,
        gameId,
        gameState: onGoingGame.state as AllGameStates,
        players: sortedPlayers,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
