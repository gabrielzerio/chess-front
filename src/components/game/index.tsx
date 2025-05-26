import { useEffect, useRef, useState } from "react";
import type { PieceType, PieceColor, Piece, Position, IPlayer, Board } from "../../types/types";
import { useUser } from "../../UserContext";
import { BoardContainer } from "./board/BoardGrid";
import { BoardPiece } from "./board/BoardPiece";
import { DeadPieces } from "./DeadPieces";
import { GameHeader } from "./GameHeader";
import { socket } from "../../socket";

interface IHightlights {
  highlights: Position[];
  captureHightlights: Position[];
}

const pieceSymbols: Record<PieceType, Record<PieceColor, string>> = {
  rook: { white: "♖", black: "♜" },
  knight: { white: "♘", black: "♞" },
  bishop: { white: "♗", black: "♝" },
  queen: { white: "♕", black: "♛" },
  king: { white: "♔", black: "♚" },
  pawn: { white: "p", black: ("o") },
};

export function Game() {
  const boardRefs = useRef<(HTMLDivElement | null)[][]>(
    Array(8).fill(null).map(() => Array(8).fill(null))
  );
  const initialBoard: (Piece | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard);

  const [selected, setSelected] = useState<Position | null>(null);

  const {
    // darkMode,
    // setDarkMode,
    setHighlights,
    setCaptureHighlights,
    playerColor,
    setPlayerColor,
    setTurn,
    promotionModal,
    setPromotionModal,
    endGameModal,
    turn,
    playerName,
    deadPieces,
    moveInfo,
    captureHighlights,
    highlights,
    setMoveInfo,
    playerID,
    gameID, 
  } = useUser();

  useEffect(() => {
    if (!endGameModal.open) return;
    new Audio("/sounds/gameover.mp3").play();
  }, [endGameModal.open]);

  

  useEffect(() => {
    if(!gameID || !playerID){
      console.log(gameID, playerID)
     return;
    }
    const playerInfos:IPlayer = {gameID:gameID, playerID:playerID};
    socket.auth = playerInfos;
    
    socket.connect();

    function handleJoined({ board, color, turn, status }: { board: Board, color: PieceColor, turn: PieceColor, status: string }) {
    setBoard(board);
    setPlayerColor(color);
    setTurn(turn);
    setMoveInfo(status);
  }
  if(socket.connected){
      socket.emit('joinGame', handleJoined);
  }
    
  },)
  
  // Utilitário: remove destaques
  const removeHighlight = () => {
    setHighlights([]);
    setCaptureHighlights([]);
  };


  // Clique no tabuleiro
  const handleSquareClick = async (position: Position) => {
    const { row, col } = position;
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

        socket.emit('requestPossibleMoves', { from: { row, col } }, (response: IHightlights) => { //utilização de callback
          setHighlights(response.highlights);
          setCaptureHighlights(response.captureHightlights);
          console.log(response)
        })

      } else {
        removeHighlight();

      }
    }
  };


  // Função para enviar movimento ao servidor (corrigida)
  function sendMove(from: Position, to: Position, promotionType?: PieceType) {
    if (!playerColor) {
      setMoveInfo("Você não está em uma partida ativa.");
      return;
    }
    socket?.emit('makeMove', { from, to, promotionType, playerName: playerName });
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

  function handleRestart() {

  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center md:justify-center w-full h-screen sm:h-full sm:px-2 py-4 bg-gray-100 dark:bg-gray-900 font-sans text-neutral-900 dark:text-neutral-100">
      {/* <button onClick={() => setDarkMode(!darkMode)}
//           className="absolute bottom-4 md:-bottom-0 right-4 z-50 px-4 py-2 rounded-lg font-bold text-sm
//         bg-neutral-800 text-white hover:bg-yellow-400 hover:text-black dark:bg-yellow-500 dark:text-black dark:hover:bg-neutral-800 dark:hover:text-white">
//         {darkMode ? "Modo Claro ☀️" : "Modo Escuro 🌙"}
//         </button> */}
      <div className="order-1 lg:order-1 w-full lg:w-auto flex flex-row gap-10 items-center">


        <DeadPieces
          deadPieces={deadPieces}
          pieceSymbols={pieceSymbols}
          endGameModal={endGameModal}
        />


        {/* Chess Board & Info */}
        <div className={`chess-container flex flex-col gap-2 sm:gap-5 w-fit ${endGameModal.open ? "blur-sm" : ""}`}>
          <GameHeader
            handleRestart={handleRestart}
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
                      handleSquareClick={handleSquareClick} />
                    //CODIGO DE TABULEIRO INVERTIDO ABAIXO
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
            // onClick={() => handleRestart(null)}
            >
              Encerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}