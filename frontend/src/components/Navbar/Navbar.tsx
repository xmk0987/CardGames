import { useNavigate } from "react-router";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isHomePage = window.location.pathname === "/";

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
            <button onClick={() => handleNavigate("/")}>Games</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
