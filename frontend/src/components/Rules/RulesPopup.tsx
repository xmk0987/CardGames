import React, { useState } from "react";
import Rules from "./Rules";
import RulesButton from "./RulesButton";
import styles from "./Rules.module.css";
import ModalLayout from "../../layouts/ModalLayout/ModalLayout";

interface RulesPopupProps {
  header: string;
  rules: string[];
}

const RulesPopup: React.FC<RulesPopupProps> = ({ header, rules }) => {
  const [showRules, setRules] = useState<boolean>(false);

  const toggleRules = (): void => {
    setRules(!showRules);
  };

  return (
    <>
      {showRules ? (
        <ModalLayout onClose={() => setRules(false)}>
          <h2>{header}</h2>
          <div className={styles.rulesContainer}>
            <Rules rules={rules} />
          </div>
          <button onClick={toggleRules} className={styles.popupClose}>
            CLOSE
          </button>
        </ModalLayout>
      ) : (
        <RulesButton toggleRules={toggleRules} />
      )}
    </>
  );
};

export default RulesPopup;
