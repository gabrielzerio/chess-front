import { useRef } from "react";
import type { PieceType, PieceColor, Piece, Position } from "../../types/types";
import { useUser } from "../../UserContext";
import { BoardContainer } from "./board/BoardGrid";
import { BoardPiece } from "./board/BoardPiece";
import { DeadPieces } from "./DeadPieces";
import { GameHeader } from "./GameHeader";

interface GameInterface {
    pieceSymbols:Record<PieceType, Record<PieceColor, string>>
    board: (Piece | null)[][];
    handleRestart: () =>void;
    handleSquareClick:(position: Position) => Promise<void>
}

export function Game({handleRestart, pieceSymbols, board, handleSquareClick}:GameInterface){
    const boardRefs = useRef<(HTMLDivElement | null)[][]>(
       Array(8).fill(null).map(() => Array(8).fill(null))
     );
    const contexto = useUser();
    return (
          <div className="order-1 lg:order-1 w-full lg:w-auto flex flex-row gap-10 items-center">
              
         
                <DeadPieces 
                  deadPieces={contexto.deadPieces}
                  pieceSymbols={pieceSymbols}
                  endGameModal={contexto.endGameModal}
                />
            
        
              {/* Chess Board & Info */}
              <div className={`chess-container flex flex-col gap-2 sm:gap-5 w-fit ${contexto.endGameModal.open ? "blur-sm" : ""}`}>
                <GameHeader 
                handleRestart={handleRestart}
                />
        
                <div>
                  <div id="board-wrapper" className="flex">
                    {/* Board */}
                    <BoardContainer>
                      {board.map((rowArr, row) =>
                        rowArr.map((piece, col) => {
                          const isHighlight = contexto.highlights.some(pos => pos.row === row && pos.col === col);
                          const isCapture = contexto.captureHighlights.some(pos => pos.row === row && pos.col === col);
                          
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
                    <p id="move-info" className="text-2xl h-8 mb-2">{contexto.moveInfo}</p>
                  </div>
                </div>
              </div>
    )
}