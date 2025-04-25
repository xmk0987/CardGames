import React, { useEffect, useState } from "react";
import ModalLayout from "../../layouts/ModalLayout/ModalLayout";
import { useSocket } from "../../context/socket/useSocket";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

interface CreateUserProps {
  gameId: string | undefined;
  cancelJoin: () => void;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
}

const CreateUser: React.FC<CreateUserProps> = ({
  gameId,
  cancelJoin,
  message,
  setMessage,
}) => {
  const socket = useSocket();
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user && socket) {
      const parsedUser = JSON.parse(user);
      if (gameId && gameId === parsedUser.gameId) {
        socket.emit("joinLobby", gameId, parsedUser);
      } else {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, [gameId, socket]);

  if (loading) return <div>Loading ...</div>;

  if (!gameId) return <div>Game not found</div>;

  const joinLobby = (username: string) => {
    if (loading) return;

    if (!socket) {
      setMessage("Can't connect to server. Refresh Page");
      return;
    }

    if (username.trim() === "") {
      setMessage("Username cant be empty.");
      return;
    }

    setLoading(true);

    setMessage("");

    const userData = {
      username,
      socketId: socket.id,
      gameId,
      isAdmin: false,
      id: crypto.randomUUID(),
    };

    socket.emit("joinLobby", gameId, userData);
    setLoading(false);
  };

  return (
    <ModalLayout onClose={cancelJoin}>
      <h2>Create player</h2>
      {message !== "" && <p>{message}</p>}
      <label>Enter username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <PrimaryButton
        text="Join"
        onClick={() => joinLobby(username)}
        isDisabled={username.trim() === ""}
      />
    </ModalLayout>
  );
};

export default CreateUser;
