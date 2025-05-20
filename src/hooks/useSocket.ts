// src/hooks/useSocket.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Piece, Position, PieceType } from "../types/types";

interface JoinPayload {
  gameId: string;
  playerName: string;
}

interface UseSocketProps {
  gameId: string;
  playerName: string;
  onUpdateBoard: (board: (Piece | null)[][], turn: string) => void;
  onGameOver: (winner: string) => void;
  onJoined: (board: (Piece | null)[][], color: string, turn: string) => void;
}

export const useSocket = ({
  gameId,
  playerName,
  onUpdateBoard,
  onGameOver,
  onJoined,
}: UseSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!gameId || !playerName) return;

    const socket = io(import.meta.env.VITE_WS_API_URL);

    socket.on("connect", () => {
      socket.emit("join", { gameId, playerName } as JoinPayload);
    });

    socket.on("joined", ({ board, color, turn }) => {
      onJoined(board, color, turn);
    });

    socket.on("boardUpdate", ({ board, turn }) => {
      onUpdateBoard(board, turn);
    });

    socket.on("gameOver", ({ winner }) => {
      onGameOver(winner);
    });

    socket.on("moveError", ({ message }) => {
      alert(message);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [gameId, playerName]);

  const sendMove = (from: Position, to: Position, promotionType?: PieceType) => {
    socket?.emit("move", { gameId, from, to, promotionType, playerName });
  };

  return { socket, sendMove };
};
