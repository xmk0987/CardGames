import { Outlet } from "react-router";
import { GameStateProvider } from "../../context/gameState/GameStateProvider";

const GameLayout = () => {
  return (
    <GameStateProvider>
      <Outlet />
    </GameStateProvider>
  );
};

export default GameLayout;
