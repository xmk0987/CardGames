import styles from "./ModalLayout.module.css";
import CloseIcon from "../../assets/icons/CloseIcon";
import { ReactNode } from "react";

interface ModalLayoutProps {
  children: ReactNode;
  onClose: () => void;
}

const ModalLayout = ({ children, onClose }: ModalLayoutProps) => {
  return (
    <div className="modal" onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <CloseIcon size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalLayout;
