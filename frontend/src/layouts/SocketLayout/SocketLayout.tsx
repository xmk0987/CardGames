import { Outlet } from "react-router";
import { SocketProvider } from "../../context/socket/SocketProvider";
import React from "react";

const SocketLayout = () => {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
};

export default SocketLayout;
