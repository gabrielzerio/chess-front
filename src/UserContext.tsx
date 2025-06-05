import { createContext, useState, useContext } from 'react';
import type { Piece, PieceColor, Position } from './types/types';

interface UserContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;

  gameID: string | null;
  setGameID: (id: string) => void;

  highlights: Position[];
  setHighlights: (positions: Position[]) => void;

  captureHighlights: Position[];
  setCaptureHighlights: (positions: Position[]) => void;

  playerColor: PieceColor | null;
  setPlayerColor: (color: PieceColor | null) => void;

  promotionModal: { open: boolean; position?: Position; color?: PieceColor; squareRect?: DOMRect };
  setPromotionModal: (modal: { open: boolean; position?: Position; color?: PieceColor; squareRect?: DOMRect }) => void;

  endGameModal: { open: boolean; winner?: string };
  setEndGameModal: (modal: { open: boolean; winner?: string }) => void;

  inputPlayerName: string;
  setInputPlayerName: (name: string) => void;

  JoinInputPlayerName: string;
  setJoinInputPlayerName: (name: string) => void;

  inputGameID: string;
  setInputGameID: (id: string) => void;

  turn:PieceColor;
  setTurn:(color:PieceColor) => void;

  playerName: string | null;
  setPlayerName: (name: string | null) => void;
  
  moveInfo: string|null;
  setMoveInfo: (info:string) => void;

  playerID: string|null;
  setPlayerID: (id:string) => void;

  gameStatus: string|null;
  setGameStatus: (status:string) => void;

  // ...existing code...
deadPieces: { white: Piece[]; black: Piece[] };
setDeadPieces: (pieces: { white: Piece[]; black: Piece[] }) => void;

  resetSessionStates: () => void; // Função para limpar os estados da sessão
// ...existing code...
};

const UserContext = createContext<UserContextType | undefined>(undefined);

function UserProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [gameID, setGameID] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Position[]>([]);
  const [captureHighlights, setCaptureHighlights] = useState<Position[]>([]);
  const [playerColor, setPlayerColor] = useState<PieceColor | null>(null);
  const [promotionModal, setPromotionModal] = useState<{ open: boolean; position?: Position; color?: PieceColor; squareRect?: DOMRect }>({ open: false });
  const [endGameModal, setEndGameModal] = useState<{ open: boolean; winner?: string }>({ open: false });
  const [inputPlayerName, setInputPlayerName] = useState<string>("");
  const [JoinInputPlayerName, setJoinInputPlayerName] = useState<string>("");
  const [inputGameID, setInputGameID] = useState<string>("");
  const [turn, setTurn] = useState<PieceColor>("white");
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [moveInfo, setMoveInfo] = useState("Clique em uma peça para mover");
  const [deadPieces, setDeadPieces] = useState<{ white: Piece[]; black: Piece[] }>({ white: [], black: [] });
  const [playerID, setPlayerID] = useState<string|null>(null);
  const [gameStatus, setGameStatus] = useState<string|null>(null);

  // Função para resetar os estados relevantes da sessão
  const resetSessionStates = () => {
    setGameID(null);
    setHighlights([]);
    setCaptureHighlights([]);
    setPlayerColor(null);
    setPromotionModal({ open: false });
    setEndGameModal({ open: false });
    setInputPlayerName("");
    setJoinInputPlayerName("");
    setInputGameID("");
    setTurn("white");
    setPlayerName(null);
    setMoveInfo("Clique em uma peça para mover");
    setDeadPieces({ white: [], black: [] });
    setPlayerID(null);
    setGameStatus(null);
  };

  return (
    <UserContext.Provider value={{
      darkMode, setDarkMode,
      gameID, setGameID,
      highlights, setHighlights,
      captureHighlights, setCaptureHighlights,
      playerColor, setPlayerColor,
      promotionModal, setPromotionModal,
      endGameModal, setEndGameModal,
      inputPlayerName, setInputPlayerName,
      JoinInputPlayerName, setJoinInputPlayerName,
      inputGameID, setInputGameID,
      turn, setTurn,
      playerName, setPlayerName,
      moveInfo, setMoveInfo,
      deadPieces, setDeadPieces,
      playerID, setPlayerID,
      gameStatus, setGameStatus,
      resetSessionStates, // Exponha a nova função
    }}>
      {children}
    </UserContext.Provider>
  );
  
}

export { UserProvider, UserContext };

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser precisa estar dentro do UserProvider');
  return context;
};