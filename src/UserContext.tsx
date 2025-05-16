import { createContext, useState, useContext, useRef } from 'react';
import type { Piece, PieceColor, Position } from './types/types';

{/*
   
   // const [inputPlayerName, setInputPlayerName] = useState<string>(""); // usado no input do nome no modal quando cria uma sala
   // const [JoinInputPlayerName, setJoinInputPlayerName] = useState<string>(""); // usado no input do nome quando vai entrar em sala existente no modal
   // const [inputGameId, setInputGameId] = useState<string>(""); // usado no input do id do jogo no modal
  // const [playerColor, setPlayerColor] = useState<PieceColor | null>(null);
    // // Modais
    // const [promotionModal, setPromotionModal] = useState<{ open: boolean; position?: Position; color?: PieceColor; squareRect?: DOMRect }>(
    //   { open: false }
    // );
    // const [endGameModal, setEndGameModal] = useState<{ open: boolean; winner?: string }>({ open: false });
    // const [joinOrCreateModal, setJoinOrCreateModal] = useState(true);
    // // Nomes dos jogadores
    // const gameId = useRef<string | null>(null); //são refs pois não renderizam, é tipo uma variavel comum msm
    // const playerName = useRef<string | null>(null);
     // const [turn, setTurn] = useState<PieceColor>("white");
      // const [moveInfo, setMoveInfo] = useState("Clique em uma peça para mover");
      // const [highlights, setHighlights] = useState<Position[]>([]);
      // const [captureHighlights, setCaptureHighlights] = useState<Position[]>([]);
        // const [deadPieces, setDeadPieces] = useState<{ white: Piece[]; black: Piece[] }>({ white: [], black: [] });
  //   const [darkMode, setDarkMode] = useState(true);
  */}

type UserContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;

 gameId: string | null;
 setGameId: (id: string | null) => void;

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

  joinOrCreateModal: boolean;
  setJoinOrCreateModal: (value: boolean) => void;

  inputPlayerName: string;
  setInputPlayerName: (name: string) => void;

  JoinInputPlayerName: string;
  setJoinInputPlayerName: (name: string) => void;

  inputGameId: string;
  setInputGameId: (id: string) => void;

  turn:PieceColor;
  setTurn:(color:PieceColor) => void;

  playerName: string | null;
  setPlayerName: (name: string | null) => void;
  
  moveInfo: string|null;
  setMoveInfo: (info:string) => void;

  // ...existing code...
deadPieces: { white: Piece[]; black: Piece[] };
setDeadPieces: (pieces: { white: Piece[]; black: Piece[] }) => void;
// ...existing code...
};

const UserContext = createContext<UserContextType | undefined>(undefined);

function UserProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [gameId, setGameId] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Position[]>([]);
  const [captureHighlights, setCaptureHighlights] = useState<Position[]>([]);
  const [playerColor, setPlayerColor] = useState<PieceColor | null>(null);
  const [promotionModal, setPromotionModal] = useState<{ open: boolean; position?: Position; color?: PieceColor; squareRect?: DOMRect }>({ open: false });
  const [endGameModal, setEndGameModal] = useState<{ open: boolean; winner?: string }>({ open: false });
  const [joinOrCreateModal, setJoinOrCreateModal] = useState(true);
  const [inputPlayerName, setInputPlayerName] = useState<string>("");
  const [JoinInputPlayerName, setJoinInputPlayerName] = useState<string>("");
  const [inputGameId, setInputGameId] = useState<string>("");
  const [turn, setTurn] = useState<PieceColor>("white");
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [moveInfo, setMoveInfo] = useState("Clique em uma peça para mover");
  const [deadPieces, setDeadPieces] = useState<{ white: Piece[]; black: Piece[] }>({ white: [], black: [] });

  return (
    <UserContext.Provider value={{
      darkMode, setDarkMode,
      gameId, setGameId,
      highlights, setHighlights,
      captureHighlights, setCaptureHighlights,
      playerColor, setPlayerColor,
      promotionModal, setPromotionModal,
      endGameModal, setEndGameModal,
      joinOrCreateModal, setJoinOrCreateModal,
      inputPlayerName, setInputPlayerName,
      JoinInputPlayerName, setJoinInputPlayerName,
      inputGameId, setInputGameId,
      turn, setTurn,
      playerName, setPlayerName,
      moveInfo, setMoveInfo,
      deadPieces, setDeadPieces
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