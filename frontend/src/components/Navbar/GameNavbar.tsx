import styles from "./Navbar.module.css";

interface NavBarProps {
  leaveLobby?: () => void;
}

const GameNavbar: React.FC<NavBarProps> = ({ leaveLobby }) => {
  return (
    <nav
      className={styles["navbar"]}
      style={{
        justifyContent: "space-between",
      }}
    >
      <p>DrinkingGames</p>
      <ul>
        <li>
          <button onClick={leaveLobby}>Leave</button>
        </li>
      </ul>
    </nav>
  );
};

export default GameNavbar;
