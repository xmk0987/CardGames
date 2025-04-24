import { useState, useEffect, useRef } from "react";
import { useFuckTheDealerGameState } from "../../../../../hooks/useFuckTheDealerGameState";
import ModalLayout from "../../../../../layouts/ModalLayout/ModalLayout";
import styles from "./MessagePopup.module.css";
import PrimaryButton from "../../../../PrimaryButton/PrimaryButton";

const MessagePopup = () => {
  const { gameState } = useFuckTheDealerGameState();
  const [showPopup, setShowPopup] = useState(false);
  const prevMessageRef = useRef<string>("");

  useEffect(() => {
    const currentMessage = gameState.message;
    const prevMessage = prevMessageRef.current;

    if (currentMessage && currentMessage !== prevMessage) {
      setShowPopup(true);
    }

    // Update ref to the current message
    prevMessageRef.current = currentMessage;
  }, [gameState.message]);

  return (
    <>
      {showPopup ? (
        <ModalLayout onClose={() => setShowPopup(false)}>
          <h2>Action</h2>
          <p className={styles.message}>{gameState.message}</p>
          <PrimaryButton onClick={() => setShowPopup(false)} text="Close" />
        </ModalLayout>
      ) : (
        <button
          className={styles.messageBtn}
          onClick={() => setShowPopup(true)}
        >
          Message
        </button>
      )}
    </>
  );
};

export default MessagePopup;
