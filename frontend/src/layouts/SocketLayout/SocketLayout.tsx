import { Outlet } from "react-router";
import { SocketProvider } from "../../context/socket/SocketProvider";

const SocketLayout = () => {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
};

export default SocketLayout;
