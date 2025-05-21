import React, { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import ModalInicio from "./components/modals/Modal";

import type { PieceColor, PieceType, Position, Piece} from "./types/types";
import { DeadPieces } from "./components/game/DeadPieces";
import { GameHeader } from "./components/game/GameHeader";
import { useUser } from "./UserContext";
import { BoardPiece } from "./components/game/board/BoardPiece";
import { BoardContainer } from "./components/game/board/BoardGrid";


interface JoinPayload  {
  gameId:string,
  playerName:string
}

const pieceSymbols: Record<PieceType, Record<PieceColor, string>> = {
  rook: { white: "♖", black: "♜" },
    knight: { white: "♘", black: "♞" },
    bishop: { white: "♗", black: "♝" },
    queen: { white: "♕", black: "♛" },
    king: { white: "♔", black: "♚" },
    pawn: { white: "p", black:("o") },
};

const HTTP_API_URL = import.meta.env.VITE_HTTP_API_URL;
const WS_API_URL =  import.meta.env.VITE_WS_API_URL;

const initialBoard: (Piece | null)[][] = Array(8)
  .fill(null)
  .map(() => Array(8).fill(null));

async function createGame() {
  const response = await fetch(`${HTTP_API_URL}/createGame`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  return data.gameId;
}


async function deleteGame(gameId: string) {
  const response = await fetch(`${HTTP_API_URL}/games/${gameId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return await response.json();
}


export const ChessGame: React.FC = () => {
const {
  darkMode,
  setDarkMode,
  gameId,
  setGameId,
  highlights,
  setHighlights,
  captureHighlights,
  setCaptureHighlights,
  playerColor,
  setPlayerColor,
  promotionModal,
  setPromotionModal,
  endGameModal,
  setEndGameModal,
  joinOrCreateModal,
  setJoinOrCreateModal,
  inputPlayerName,
  setInputPlayerName,
  JoinInputPlayerName,
  setJoinInputPlayerName,
  inputGameId,
  setInputGameId,
  turn,
  setTurn,
  playerName,
  setPlayerName,
  moveInfo, setMoveInfo,
  deadPieces, setDeadPieces
} = useUser();


  // // Estados principais
  const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard);

  const [selected, setSelected] = useState<Position | null>(null);
 
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const [effect, setEffect] = useState(false); // usado para forçar o re-render do componente no effect

  
  // refs para posicionamento do modal de promoção
  const boardRefs = useRef<(HTMLDivElement | null)[][]>(
    Array(8).fill(null).map(() => Array(8).fill(null))
  );

  // Previne fechar modais com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ( promotionModal.open || endGameModal.open) {
        if (e.key === "Escape") e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [ promotionModal.open, endGameModal.open]);

// 3. Conectar ao WebSocket ao entrar na sala
  useEffect(() => {
       
  //   try{
  //     await getGameExists(lsGameId ,lsPlayerName);
  //     setGameId(lsGameId);
  //     setPlayerName(lsPlayerName);
  //     setJoinOrCreateModal(false);
  //   } catch(error){
  //     console.error("Erro ao restaurar sessão:", error);
  //     localStorage.removeItem("playerName");
  //     localStorage.removeItem("gameId");
  //   }
    
  // if (!lsGameId || !lsPlayerName) return;

  const socket = io(WS_API_URL);

    // const payload:JoinPayload = {
    //   gameId:gameId.current, playerName:playerName.current
    // }

  socket.on("connect", () => {
    socket.emit("joinGame", {gameId, playerName} as JoinPayload); //passagem de objeto tipado com as
  });

  socket.on("joinedGame", ({ board, color, turn }) => {
    setBoard(board);
    console.log(board);
    setPlayerColor(color);
    setTurn(turn);
    setMoveInfo(color ? `Você está jogando de ${color === "white" ? "brancas" : "pretas"}` : "");
  });

  socket.on("boardUpdate", ({ board, turn }) => {
    setBoard(board);
    setTurn(turn);
    playAudioMove();
  });

  socket.on("moveError", ({ message }) => {
    
  });

  socket.on("gameOver", ({ winner }) => {
    console.log("recebi gameOver sim", winner);
    setEndGameModal({ open: true, winner: `o Ganhador foi ${winner}` });
  });

  setSocket(socket);

  return () => {
    socket.disconnect();
  };

fetchValidGame();
}, [effect]);


useEffect(() => {
  const root = window.document.documentElement;
  if (darkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}, [darkMode]);

// 4. Tocar som de game over
useEffect(() => {
  if (!endGameModal.open) return;
  new Audio("/sounds/gameover.mp3").play();
}, [endGameModal.open]);

  
  // Utilitário: remove destaques
  const removeHighlight = () => {
    setHighlights([]);
    setCaptureHighlights([]);
  };

  

  // Clique no tabuleiro
  const handleSquareClick = async (row: number, col: number) => {
    
      if (playerColor && turn !== playerColor) {
        setMoveInfo("Aguarde sua vez.");
        return;
      } 
      setMoveInfo(`Clicou em ${String.fromCharCode(65 + col)}${8 - row}`);
    if (selected && (selected.row !== row || selected.col !== col)) {
      if (playerColor && turn === playerColor) {
        const piece = board[selected.row][selected.col];
        // Verifica se é um peão chegando na última linha
        if (
          piece &&
          piece.type === "pawn" &&
          ((piece.color === "white" && row === 0) ||
            (piece.color === "black" && row === 7))
        ) {
          // Abre o modal e espera a escolha
          const promotionType = await showPromotionDialog(piece.color, { row, col });
          sendMove(selected, { row, col }, promotionType);
        } else {
          sendMove(selected, { row, col });
        }
      } 
      setSelected(null);
      removeHighlight();
    } else {
      setSelected({ row, col });
      // NOVO: buscar movimentos possíveis do back-end
      console.log("cor do jgoador atual", playerColor)
      if (board[row][col] && (!playerColor || board[row][col]?.color === playerColor)) {
        // const response = await fetch(`${HTTP_API_URL}/games/${gameId}/moves`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ from: { row, col } })
        // });
        // const data = await response.json();
        socket?.emit('requestPossibleMoves', {from:{row,col}});
        socket?.on('possibleMovesResponse', ({normalMoves, captureMoves}) =>{

          setHighlights(normalMoves);
        setCaptureHighlights(captureMoves);
        });



        

      } else {
        removeHighlight();
        
      }
    }
  };

function playAudioMove(){
  new Audio("/sounds/moveSound.mp3").play();
}

  // Função para enviar movimento ao servidor (corrigida)
  function sendMove(from: Position, to: Position, promotionType?: PieceType) {
    if (!playerColor) {
      setMoveInfo("Você não está em uma partida ativa.");
      return;
    }
    socket?.emit('move', { gameId:gameId, from, to, promotionType, playerName:playerName });
  }

  // Modal de promoção
  const showPromotionDialog = (color: PieceColor, position: Position) => {
    const square = boardRefs.current[position.row][position.col];
    const squareRect = square?.getBoundingClientRect();
    setPromotionModal({ open: true, color, position, squareRect });
    return new Promise<PieceType>((resolve) => {
      // handlerPromotion resolve a promise
      const handlerPromotion = (type: PieceType) => {
        setPromotionModal({ open: false });
        resolve(type);
      };
      (window as any).handlePromotion = handlerPromotion;
    });
  };

  // Modal de promoção: handler
  const handlePromotion = (type: PieceType) => {
    setPromotionModal({ open: false });
    if ((window as any).handlePromotion) (window as any).handlePromotion(type);
  };

  // Modal de reinício
  const handleRestart = (op:string | null) => {
    socket?.disconnect(); 
    setEndGameModal({ open: false });
     localStorage.removeItem("gameId");
    localStorage.removeItem("playerName");
    setDeadPieces({ white: [], black: [] });
    setTurn("white");
      if(!gameId){ 
        console.log('erro, o ref gameId não existe');
        return;
      }
      if(!op && op!=='leave'){
      deleteGame(gameId);
      setJoinOrCreateModal(true);
      }
     else{
      setJoinOrCreateModal(true);
     }
  };
  const cleanStates = () => {
    setInputPlayerName("");
    setInputGameId("");
    setJoinInputPlayerName("");
  }

  // Novo: fluxo para criar jogo
  const handleCreateGame = async () => {
    if (!inputPlayerName) return;
    const id = await createGame();
    setGameId(id);
    setPlayerName(inputPlayerName);
    setJoinOrCreateModal(false);
    setMoveInfo(`Aguardando outro jogador entrar... (ID: ${id})`);
    localStorage.setItem("gameId", id);
    localStorage.setItem("playerName", inputPlayerName)
    cleanStates();
    setEffect(!effect); // força o re-render
  };

  // Novo: fluxo para entrar em jogo existente
  const handleJoinGame = async () => {
    if (!inputGameId || !JoinInputPlayerName) return;
      socket?.emit('join');
      

      setGameId(inputGameId); //atribui o valor do state ao ref
      setPlayerName(JoinInputPlayerName); //atribui o valor do state ao ref
  
      setJoinOrCreateModal(false); // fecha o modal
      
      // setMoveInfo(`Entrou no jogo ${joinGameId}`);
      localStorage.setItem("gameId", inputGameId);
      localStorage.setItem("playerName", JoinInputPlayerName);
      cleanStates();
      setEffect(!effect); // força o re-render
    
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center md:justify-center w-full h-screen sm:h-full sm:px-2 py-4 bg-gray-100 dark:bg-gray-900 font-sans text-neutral-900 dark:text-neutral-100">
        {/* <button onClick={() => setDarkMode(!darkMode)}
          className="absolute bottom-4 md:-bottom-0 right-4 z-50 px-4 py-2 rounded-lg font-bold text-sm
        bg-neutral-800 text-white hover:bg-yellow-400 hover:text-black dark:bg-yellow-500 dark:text-black dark:hover:bg-neutral-800 dark:hover:text-white">
        {darkMode ? "Modo Claro ☀️" : "Modo Escuro 🌙"}
        </button> */}

    <ModalInicio
      handleCreateGame={handleCreateGame}
      handleJoinGame={handleJoinGame}
    />

    <div className="order-1 lg:order-1 w-full lg:w-auto flex flex-row gap-10 items-center">
      
 
        <DeadPieces 
          deadPieces={deadPieces}
          pieceSymbols={pieceSymbols}
          endGameModal={endGameModal}
        />
    

      {/* Chess Board & Info */}
      <div className={`chess-container flex flex-col gap-2 sm:gap-5 w-fit ${endGameModal.open ? "blur-sm" : ""}`}>
        <GameHeader handleRestart={handleRestart}
        />

        <div>
          <div id="board-wrapper" className="flex">
            {/* Board */}
            <BoardContainer>
              {board.map((rowArr, row) =>
                rowArr.map((piece, col) => {
                  const isHighlight = highlights.some(pos => pos.row === row && pos.col === col);
                  const isCapture = captureHighlights.some(pos => pos.row === row && pos.col === col);
                  
                  return <BoardPiece 
                
                  row={row}
                  col={col}
                  boardRefs={boardRefs}
                  isHighlight={isHighlight}
                  isCapture={isCapture}
                  piece={piece}
                  handleSquareClick={handleSquareClick}
                  /> //CODIGO DE TABULEIRO INVERTIDO ABAIXO
  //                 {(playerColor === "black" ? board.slice().reverse() : board).map((rowArr, rowIdx) =>
  //   (playerColor === "black" ? rowArr.slice().reverse() : rowArr).map((piece, colIdx) => (
  //     <BoardPiece
  //       row={playerColor === "black" ? 7 - rowIdx : rowIdx}
  //       col={playerColor === "black" ? 7 - colIdx : colIdx}
  //       boardRefs={boardRefs}
  //       isHighlight={highlights.some(pos =>
  //         pos.row === (playerColor === "black" ? 7 - rowIdx : rowIdx) &&
  //         pos.col === (playerColor === "black" ? 7 - colIdx : colIdx)
  //       )}
  //       isCapture={captureHighlights.some(pos =>
  //         pos.row === (playerColor === "black" ? 7 - rowIdx : rowIdx) &&
  //         pos.col === (playerColor === "black" ? 7 - colIdx : colIdx)
  //       )}
  //       piece={piece}
  //       handleSquareClick={handleSquareClick}
  //     />
  //   )) 
  // )}
                })
              )}
            </BoardContainer>

            </div>
            {/* Y Coordinates */}
            
          </div>
          {/* X Coordinates */}
          <div className="x-coordinates grid grid-cols-8 mt-2 text-lg font-bold text-neutral-800 dark:text-neutral-200 text-center">
            {["A", "B", "C", "D", "E", "F", "G", "H"].map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>

          {/* Info Panel */}
          <div className="info-panel text-center mt-2">
            <p id="move-info" className="text-2xl h-8 mb-2">{moveInfo}</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {promotionModal.open && (
        <div
          className="fixed z-50"
          style={{
            left: promotionModal.squareRect?.left,
            top: promotionModal.color === "white"
              ? (promotionModal.squareRect?.top ?? 0) - 60
              : (promotionModal.squareRect?.bottom ?? 0),
            position: "absolute"
          }}
        >
          <div className="bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-700 dark:border-yellow-500 rounded-lg p-6 shadow-lg">
            <h2 className="font-serif text-xl font-bold mb-4">Escolha uma peça para promoção</h2>
            <div className="flex gap-4 justify-center">
              {(["queen", "rook", "bishop", "knight"] as PieceType[]).map((type) => (
                <button
                  key={type}
                  className="text-3xl w-12 h-12 p-1 cursor-pointer bg-yellow-100 dark:bg-yellow-800 border border-yellow-700 rounded hover:bg-yellow-700 hover:text-yellow-100 dark:hover:bg-yellow-500 dark:hover:text-neutral-900"
                  onClick={() => handlePromotion(type)}
                >
                  {pieceSymbols[type][promotionModal.color!]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* End Game Modal */}
      {endGameModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl border-4 border-neutral-800 dark:border-neutral-200 shadow-xl flex flex-col gap-4 items-center">
            <h2 className="font-serif text-2xl font-bold">Fim de Jogo!</h2>
            <p id="winnerMessage">{endGameModal.winner}</p>
            <button
              className="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-600 hover:text-neutral-900 dark:hover:bg-yellow-400"
              onClick={() => handleRestart(null)}
            >
              Encerrar
            </button>
          </div>
        </div>
      )}
    </div>
);

};

export default ChessGame;