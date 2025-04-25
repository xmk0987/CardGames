import styles from "./Rules.module.css";
import React from "react";

const Rules = ({ rules }: { rules: string[] }) => {
  return (
    <ul className={styles.rulesList}>
      {rules && rules.map((rule, index) => <li key={index}>{rule}</li>)}
    </ul>
  );
};

export default Rules;
