// src/services/socket.ts
import { io, Socket } from "socket.io-client";

const WS_API_URL = import.meta.env.VITE_WS_API_URL;

export const initSocket = ({
  gameId,
  playerName,
  onJoined,
  onBoardUpdate,
  onGameOver,
}: {
  gameId: string;
  playerName: string;
  onJoined: (data: any) => void;
  onBoardUpdate: (data: any) => void;
  onGameOver: (data: any) => void;
}) => {
  const socket = io(WS_API_URL);

  socket.on("connect", () => {
    socket.emit("join", { gameId, playerName });
  });

  socket.on("joined", onJoined);
  socket.on("boardUpdate", onBoardUpdate);
  socket.on("gameOver", onGameOver);

  return socket;
};
