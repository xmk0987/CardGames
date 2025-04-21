import React from "react";
import styles from "./PrimaryButton.module.css";

interface PrimaryButtonProps {
  text: string;
  onClick: () => void;
  isDisabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  onClick,
  isDisabled = false,
}) => {
  return (
    <button className={styles.button} onClick={onClick} disabled={isDisabled}>
      {text}
    </button>
  );
};

export default PrimaryButton;
