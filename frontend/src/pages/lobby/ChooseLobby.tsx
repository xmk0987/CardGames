import { useParams, useNavigate } from "react-router-dom";
import { games } from "../../lib/games";
import styles from "./Lobby.module.css";
import type { GameInfo } from "../../types/game.types";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import RulesPopup from "../../components/Rules/RulesPopup";
import axios from "axios";
import { SERVER_URL } from "../../lib/server";
import React from "react";

const ChooseLobby = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const navigate = useNavigate();
  const game = games[gameName as keyof typeof games] as GameInfo;

  if (!game) {
    return <div className={styles.container}>Game not found</div>;
  }

  const generateLobbyId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const checkLobbyExists = async (gameId: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${SERVER_URL}/game/${gameId}`);
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleCreateLobby = async () => {
    let lobbyId: string = "";
    let exists = true;

    while (exists) {
      lobbyId = generateLobbyId();
      exists = await checkLobbyExists(lobbyId);
    }

    navigate(`/lobby/${gameName}/${lobbyId}`);
  };

  const handleJoinLobby = () => {
    const lobbyId = prompt("Enter lobby ID to join:");
    if (lobbyId && lobbyId.trim()) {
      navigate(`/lobby/${gameName}/${lobbyId.trim()}`);
    }
  };

  return (
    <>
      <RulesPopup header={game.name} rules={game.rules} />
      <div className={styles.container}>
        <div className={styles.chooseLobbyContainer}>
          <h1>{game.name}</h1>
          <PrimaryButton text="Create lobby" onClick={handleCreateLobby} />
          <PrimaryButton text="Join lobby" onClick={handleJoinLobby} />
        </div>
      </div>
    </>
  );
};

export default ChooseLobby;
