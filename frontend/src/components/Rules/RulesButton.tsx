import React from "react";
import styles from "./Rules.module.css";

type RulesButtonProps = {
  toggleRules: () => void;
};

const RulesButton: React.FC<RulesButtonProps> = ({ toggleRules }) => (
  <button className={styles.rulesButton} onClick={toggleRules}>
    Rules
  </button>
);

export default RulesButton;
