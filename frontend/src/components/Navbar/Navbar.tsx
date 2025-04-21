import { useNavigate } from "react-router";
import styles from "./Navbar.module.css";

interface NavBarProps {
  resetGame?: () => void;
}

const Navbar: React.FC<NavBarProps> = ({ resetGame }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (resetGame) {
      resetGame();
    }
    navigate(path);
  };

  const isHomePage = window.location.pathname === "/";
  const isGamesPage = window.location.pathname === "/games";

  return (
    <nav
      className={styles["navbar"]}
      style={{
        justifyContent: "space-between",
      }}
    >
      <p>DrinkingGames</p>
      <ul>
        {!isHomePage && (
          <li>
            <button onClick={() => handleNavigate("/")}>Home</button>
          </li>
        )}
        {!isGamesPage && (
          <li>
            <button onClick={() => handleNavigate("/games")}>Games</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
