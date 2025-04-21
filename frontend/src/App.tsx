import "./App.css";
import { Route, Routes } from "react-router";
import Games from "./pages/games/Games";
import Home from "./pages/home/Home";
import GameRouter from "./pages/GameRouter/GameRouter";
import MainLayout from "./layouts/Main/MainLayout";
import Lobby from "./pages/lobby/Lobby";
import ChooseLobby from "./pages/lobby/ChooseLobby";
import GameLayout from "./layouts/Game/GameLayout";
import SocketLayout from "./layouts/SocketLayout/SocketLayout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/lobby/:gameName" element={<ChooseLobby />} />
      </Route>
      <Route element={<SocketLayout />}>
        <Route path="/lobby/:gameName/:gameId" element={<Lobby />} />
        <Route element={<GameLayout />}>
          <Route path="/game/:gameName/:gameId" element={<GameRouter />} />
        </Route>
      </Route>
      <Route path="/*" element={<Home />} />
    </Routes>
  );
}

export default App;
