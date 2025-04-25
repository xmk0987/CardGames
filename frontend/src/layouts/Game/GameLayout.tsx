import { Outlet } from "react-router";
import { GameStateProvider } from "../../context/gameState/GameStateProvider";
import React from "react";

const GameLayout = () => {
  return (
    <GameStateProvider>
      <Outlet />
    </GameStateProvider>
  );
};

export default GameLayout;
