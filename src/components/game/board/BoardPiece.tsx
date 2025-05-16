import type { JSX } from "react";
import type { PieceColor, PieceType, Piece } from "../../../types/types";

type ChildProps ={
    row:number;
    col:number;
    boardRefs:React.RefObject<(HTMLDivElement | null)[][]>
    isHighlight:boolean;
    isCapture:boolean;
    piece:Piece|null;
    handleSquareClick: (row: number, col: number) => Promise<void>
    pieceSymbols: Record<PieceType, Record<PieceColor, string>>
}
function getPieceImage(piece: Piece | null): string | null {
  if (!piece) return null;
  return `../../assets/pieces/${piece.color}_${piece.type}.svg`;
}
export function BoardPiece({row,col,boardRefs, isHighlight, isCapture, piece, handleSquareClick, pieceSymbols}:ChildProps){
  const imgSrc = getPieceImage(piece)   
  return (
                    <div key={`${row}-${col}`} id={`${row}-${col}`} ref={el => { boardRefs.current[row][col] = el; }}
                      className={`
                         flex items-center justify-center relative
                        ${(row + col) % 2 === 0 ? "bg-yellow-100 dark:bg-yellow-800" : "bg-yellow-700 dark:bg-yellow-600"} 
                        cursor-pointer transition
                        ${isHighlight ? "!bg-green-500 dark:!bg-green-700" : ""}
                        ${isCapture ? "!bg-red-500 dark:!bg-red-700" : ""}`}
                      onClick={() => handleSquareClick(row, col)}
                    >
                      {imgSrc && (
        <img
          src={imgSrc}
          alt={`${piece?.color} ${piece?.type}`}
          className="w-12 h-12 select-none pointer-events-none"
          draggable={false}
        />
      )}
                    </div>
                  );
}