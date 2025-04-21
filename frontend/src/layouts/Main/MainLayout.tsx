import { Outlet } from "react-router";
import styles from "./MainLayout.module.css";
import Navbar from "../../components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
