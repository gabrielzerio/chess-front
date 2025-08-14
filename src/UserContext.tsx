import { createContext, useState, useContext } from 'react';
import type { GameStatus, IHandleGameOver, IPlayer, Piece, PieceColor, Position } from './types/types';

interface UserContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;

  gameID: string | null;
  setGameID: (id: string | null) => void;

  highlights: Position[];
  setHighlights: (positions: Position[]) => void;

  captureHighlights: Position[];
  setCaptureHighlights: (positions: Position[]) => void;


  promotionModal: { open: boolean; position?: Position; color?: PieceColor; squareRect?: DOMRect };
  setPromotionModal: (modal: { open: boolean; position?: Position; color?: PieceColor; squareRect?: DOMRect }) => void;

  endGameModal: { open: boolean; winner?: IHandleGameOver };
  setEndGameModal: (modal: { open: boolean; winner?: IHandleGameOver }) => void;

  inputPlayerName: string;
  setInputPlayerName: (name: string) => void;

  inputGameID: string;
  setInputGameID: (id: string) => void;

  turn: PieceColor;
  setTurn: (color: PieceColor) => void;

  player: Partial<IPlayer>;
  setPlayer: (player: Partial<IPlayer>) => void;
  updatePlayerField: <K extends keyof IPlayer>(key: K, value: IPlayer[K]) => void;

  moveInfo: string | null;
  setMoveInfo: (info: string) => void;

  gameStatus: GameStatus | null;
  setGameStatus: (status: GameStatus | null) => void;

  deadPieces: { white: Piece[]; black: Piece[] };
  setDeadPieces: (pieces: { white: Piece[]; black: Piece[] }) => void;

  board: (Piece | null)[][];
  setBoard: React.Dispatch<React.SetStateAction<(Piece | null)[][]>>;

  resetSessionStates: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function UserProvider({ children }: { children: React.ReactNode }) {
  const initialBoard: (Piece | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  const [darkMode, setDarkMode] = useState(true);
  const [gameID, setGameID] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Position[]>([]);
  const [captureHighlights, setCaptureHighlights] = useState<Position[]>([]);
  const [promotionModal, setPromotionModal] = useState<{ open: boolean; position?: Position; color?: PieceColor; squareRect?: DOMRect }>({ open: false });
  const [endGameModal, setEndGameModal] = useState<{ open: boolean; winner?: IHandleGameOver }>({ open: false });
  const [inputPlayerName, setInputPlayerName] = useState<string>("");
  const [inputGameID, setInputGameID] = useState<string>("");
  const [turn, setTurn] = useState<PieceColor>("white");
  const [moveInfo, setMoveInfo] = useState<string | null>("Clique em uma peça para mover");
  const [deadPieces, setDeadPieces] = useState<{ white: Piece[]; black: Piece[] }>({ white: [], black: [] });
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);
  const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard);
  const [player, setPlayer] = useState<Partial<IPlayer>>({});

  // Função para resetar os estados relevantes da sessão
  const resetSessionStates = () => {
    setGameID(null);
    setHighlights([]);
    setCaptureHighlights([]);
    setPromotionModal({ open: false });
    setEndGameModal({ open: false });
    setInputPlayerName("");
    setInputGameID("");
    setTurn("white");
    setMoveInfo("Clique em uma peça para mover");
    setDeadPieces({ white: [], black: [] });
    setGameStatus(null);
    setPlayer({});
  };

  function updatePlayerField<K extends keyof IPlayer>(key: K, value: IPlayer[K]) {
    setPlayer(prev => ({ ...prev, [key]: value }));
  }

  return (
    <UserContext.Provider value={{
      darkMode, setDarkMode,
      gameID, setGameID,
      highlights, setHighlights,
      captureHighlights, setCaptureHighlights,
      promotionModal, setPromotionModal,
      endGameModal, setEndGameModal,
      inputPlayerName, setInputPlayerName,
      inputGameID, setInputGameID,
      turn, setTurn,
      moveInfo, setMoveInfo,
      deadPieces, setDeadPieces,
      gameStatus, setGameStatus,
      resetSessionStates,
      board, setBoard,
      player, setPlayer,
      updatePlayerField,
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